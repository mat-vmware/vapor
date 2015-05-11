#!/usr/bin/env python

import json

def read():
  f = open('hosts.json', 'r')
  hosts = json.load(f) 
  f.close()
  print hosts

def write(host):
  f = open('hosts.json', 'r')
  hosts = json.load(f) 
  f.close()
  
  f = open('hosts.json', 'w')
  hosts.append(host)
  json.dump(hosts, f)
  f.close()

def main():
  read()
  host = {"name": "esxi-003", "mac": "00-50-56-99-d9-ef", "ip": "", "netmask": "", "gateway": "", "status": 1} 
  print host
  write(host)


# Start program
if __name__ == "__main__":
   main()
