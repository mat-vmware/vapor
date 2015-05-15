#!/bin/sh

VCSA_OVA=/opt/repo/VMware-vCenter-Server-Appliance-5.5.0.20200-2183109_OVF10.ova

ESXI_HOST=172.20.10.101
ESXI_USERNAME=root
ESXI_PASSWORD=vmware123

VCSA_VMNAME=VCSA-5.5
VCSA_HOSTNAME=vapor-vcsa.mtlab.local
VCSA_IP=172.20.10.33
VCSA_NETMASK=255.255.0.0
VCSA_GATEWAY=172.20.10.1
VCSA_DNS=172.20.10.1
VM_NETWORK="VM Network"
VM_DATASTORE=datastore1

### DO NOT EDIT BEYOND HERE ###

ovftool --acceptAllEulas --skipManifestCheck --X:injectOvfEnv --noSSLVerify --powerOn "--net:Network 1=${VM_NETWORK}" --datastore=${VM_DATASTORE} --diskMode=thin --name=${VCSA_VMNAME} --prop:vami.hostname=${VCSA_HOSTNAME} --prop:vami.DNS.VMware_vCenter_Server_Appliance=${VCSA_DNS} --prop:vami.gateway.VMware_vCenter_Server_Appliance=${VCSA_GATEWAY} --prop:vami.ip0.VMware_vCenter_Server_Appliance=${VCSA_IP} --prop:vami.netmask0.VMware_vCenter_Server_Appliance=${VCSA_NETMASK} ${VCSA_OVA} "vi://${ESXI_USERNAME}:${ESXI_PASSWORD}@${ESXI_HOST}/"
