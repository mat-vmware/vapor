#!/usr/bin/env python

import json

def read():
  f = open('hosts.json', 'r')
  hosts = json.load(f) 
  f.close()
  print hosts
  print hosts.values()

def write(host):
  f = open('hosts.json', 'r')
  hosts = json.load(f) 
  f.close()
  hosts[host['name']] = host
  f = open('hosts.json', 'w')
  json.dump(hosts, f, indent=2)
  f.close()

def delete(host):
  f = open('hosts.json', 'r')
  hosts = json.load(f) 
  f.close()
  if host['name'] in hosts:
    del hosts[host['name']]  
  f = open('hosts.json', 'w')
  json.dump(hosts, f)
  f.close()

def findByMac(mac):
  f = open('hosts.json', 'r')
  hostSet = json.load(f) 
  f.close()
  filteredHostSet = [ x for x in hostSet.values() if x['mac'] == mac ] 
  return filteredHostSet[0] if len(filteredHostSet) > 0 else None
 
def main():
  read()
  host = {"name": "esxi-004", "mac": "00-50-56-99-d9-ef", "ip": "", "netmask": "", "gateway": "", "status": 1} 
  print host
  write(host)
  delete(host)
  host = findByMac("00-50-56-99-4d-84")
  host['status'] = 1 
  write(host)
  f = open('hosts.json', 'r')
  hostSet = json.load(f) 
  f.close()
  print hostSet
  for k, v in hostSet.items():
    v['status'] = 1
    hostSet[k] = v
  print hostSet
 

# Start program
if __name__ == "__main__":
   main()
