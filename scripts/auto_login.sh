#!/usr/bin/expect -f
spawn ssh root@172.20.10.33
expect "password: "
send "vmware\r"
expect "$ "
send "exit\r"
