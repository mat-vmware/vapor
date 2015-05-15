#!/usr/bin/env python
# VMware vSphere Python SDK
# Copyright (c) 2008-2015 VMware, Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""
Python program for listing the vms on an ESX / vCenter host
"""

from __future__ import print_function

import pyVmomi

from pyVmomi import vim
from pyVmomi import vmodl

from pyVim.connect import SmartConnect, Disconnect
from pyVmomi import vmodl

import argparse
import atexit
import getpass

import json

def GetArgs():
   """
   Supports the command-line arguments listed below.
   """
   parser = argparse.ArgumentParser(
       description='Process args for retrieving all the Virtual Machines')
   parser.add_argument('-s', '--host', required=True, action='store',
                       help='Remote host to connect to')
   parser.add_argument('-o', '--port', type=int, default=443, action='store',
                       help='Port to connect on')
   parser.add_argument('-u', '--user', required=True, action='store',
                       help='User name to use when connecting to host')
   parser.add_argument('-p', '--password', required=False, action='store',
                       help='Password to use when connecting to host')
   args = parser.parse_args()
   return args

def WaitForTasks(tasks, si):
   """
   Given the service instance si and tasks, it returns after all the
   tasks are complete
   """

   pc = si.content.propertyCollector

   taskList = [str(task) for task in tasks]

   # Create filter
   objSpecs = [vmodl.query.PropertyCollector.ObjectSpec(obj=task)
                                                            for task in tasks]
   propSpec = vmodl.query.PropertyCollector.PropertySpec(type=vim.Task,
                                                         pathSet=[], all=True)
   filterSpec = vmodl.query.PropertyCollector.FilterSpec()
   filterSpec.objectSet = objSpecs
   filterSpec.propSet = [propSpec]
   filter = pc.CreateFilter(filterSpec, True)

   try:
      version, state = None, None

      # Loop looking for updates till the state moves to a completed state.
      while len(taskList):
         update = pc.WaitForUpdates(version)
         for filterSet in update.filterSet:
            for objSet in filterSet.objectSet:
               task = objSet.obj
               for change in objSet.changeSet:
                  if change.name == 'info':
                     state = change.val.state
                  elif change.name == 'info.state':
                     state = change.val
                  else:
                     continue

                  if not str(task) in taskList:
                     continue

                  if state == vim.TaskInfo.State.success:
                     # Remove task from taskList
                     taskList.remove(str(task))
                  elif state == vim.TaskInfo.State.error:
                     raise task.info.error
         # Move to next version
         version = update.version
   finally:
      if filter:
         filter.Destroy()

def PrintVmInfo(vm, depth=1):
   """
   Print information for a particular virtual machine or recurse into a folder
    with depth protection
   """
   maxdepth = 10

   # if this is a group it will have children. if it does, recurse into them
   # and then return
   if hasattr(vm, 'childEntity'):
      if depth > maxdepth:
         return
      vmList = vm.childEntity
      for c in vmList:
         PrintVmInfo(c, depth+1)
      return

   summary = vm.summary
   print("Name       : ", summary.config.name)
   print("Path       : ", summary.config.vmPathName)
   print("Guest      : ", summary.config.guestFullName)
   annotation = summary.config.annotation
   if annotation != None and annotation != "":
      print("Annotation : ", annotation)
   print("State      : ", summary.runtime.powerState)
   if summary.guest != None:
      ip = summary.guest.ipAddress
      if ip != None and ip != "":
         print("IP         : ", ip)
   if summary.runtime.question != None:
      print("Question  : ", summary.runtime.question.text)
   print("")

esxis = ['esxi-01', 'esxi-02']

def reset(vm, si):
    f = open('hosts.json', 'r')
    hostSet = json.load(f) 
    f.close()
    for k, v in hostSet.items():
        v['status'] = 1
        hostSet[k] = v
    f = open('hosts.json', 'w')
    json.dump(hostSet, f, indent=2)
    f.close()
 

    if hasattr(vm, 'childEntity'):
        vmList = vm.childEntity
        for c in vmList:
            reset(c, si) 
        return

    if(vm.name in esxis):
        print(vm.name)

        if(vm.runtime.powerState == vim.VirtualMachine.PowerState.poweredOn):
            print('Doing PowerOff') 
            task = vm.PowerOff()
            WaitForTasks([task], si)
            print('PowerOff is done') 

        if(vm.runtime.powerState == vim.VirtualMachine.PowerState.poweredOff):
            controller = None
            for device in vm.config.hardware.device:
                if(type(device) is vim.vm.device.VirtualDisk):
                    print('Removing disk %d' % device.unitNumber)
                    vmConfigSpec = vim.vm.ConfigSpec()
                    removeDeviceConfigSpec = vim.vm.device.VirtualDeviceSpec()
                    removeDeviceConfigSpec.device = device
                    removeDeviceConfigSpec.operation = vim.vm.device.VirtualDeviceSpec.Operation.remove 
                    vmConfigSpec.deviceChange = [removeDeviceConfigSpec]
                    task = vm.Reconfigure(vmConfigSpec)
                    WaitForTasks([task], si)
                    print('Removing is done') 
                if(type(device) is vim.vm.device.VirtualLsiLogicController):
                    controller = device 
                    
            print('Adding a disk') 
            vmConfigSpec = vim.vm.ConfigSpec()
            addDeviceConfigSpec = vim.vm.device.VirtualDeviceSpec()

            backing = vim.vm.device.VirtualDisk.FlatVer2BackingInfo()
            backing.diskMode = vim.vm.device.VirtualDiskOption.DiskMode.persistent
            backing.thinProvisioned = True

            newDisk = vim.vm.device.VirtualDisk()
            # newDisk.capacityInBytes = int(32 * 1024 * 1024 * 1024)
            newDisk.capacityInKB = int(32 * 1024 * 1024)
            newDisk.backing = backing 
            newDisk.controllerKey = controller.key
            newDisk.unitNumber = 0

            addDeviceConfigSpec.device = newDisk
            addDeviceConfigSpec.operation = vim.vm.device.VirtualDeviceSpec.Operation.add
            addDeviceConfigSpec.fileOperation = vim.vm.device.VirtualDeviceSpec.FileOperation.create
            vmConfigSpec.deviceChange = [addDeviceConfigSpec]
            task = vm.Reconfigure(vmConfigSpec)
            WaitForTasks([task], si)
            print('Adding is done') 

            task = vm.PowerOn()
            WaitForTasks([task], si)
            print('PowerOn is done') 

def main():
   """
   Simple command-line program for listing the virtual machines on a system.
   """


   args = GetArgs()
   if args.password:
      password = args.password
   else:
      password = getpass.getpass(prompt='Enter password for host %s and '
                                        'user %s: ' % (args.host,args.user))

   si = SmartConnect(host=args.host,
                     user=args.user,
                     pwd=password,
                     port=int(args.port))
   if not si:
       print("Could not connect to the specified host using specified "
             "username and password")
       return -1

   atexit.register(Disconnect, si)

   content = si.RetrieveContent()
   for child in content.rootFolder.childEntity:
      if hasattr(child, 'vmFolder'):
         datacenter = child
         vmFolder = datacenter.vmFolder
         vmList = vmFolder.childEntity
         for vm in vmList:
            reset(vm, si)
   return 0

# Start program
if __name__ == "__main__":
   main()
