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
  json.dump(hosts, f)
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

def main():
  read()
  host = {"name": "esxi-004", "mac": "00-50-56-99-d9-ef", "ip": "", "netmask": "", "gateway": "", "status": 1} 
  print host
  write(host)
  delete(host)


# Start program
if __name__ == "__main__":
   main()
