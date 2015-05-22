#!/usr/bin/env python

import json
from os import listdir
from os.path import isfile

def list():
  pods = [ json.load(open('./vpods/' + f, 'r')) for f in listdir('./vpods') ]
  return pods

def newPod(pod):
  f = open('./vpods/' + pod['name'] + '.json', 'w')
  json.dump(pod, f, indent=2)
 
def main():
  pod = {'name': 'customer_a', 'description': 'Customizing a vpod for customer A.'}
  print list() 

# Start program
if __name__ == "__main__":
   main()
