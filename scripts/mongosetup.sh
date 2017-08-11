#!/bin/bash

echo "Waiting for the standalone Replica Set"

# apt-get update
# apt-get install -y iputils-ping

# ping google.com

MONGODB=`getent ahosts mongodb | awk 'NR==1 { print $1 }'`
# MONGODB=`ping -c 1 mongodb | head -1  | cut -d "(" -f 2 | cut -d ")" -f 1`

until curl http://mongodb:28017/serverStatus\?text\=1 2>&1 | grep uptime | head -1; do
  printf '.'
  sleep 1
done

echo curl http://mongodb:28017/serverStatus\?text\=1 2>&1 | grep uptime | head -1
echo "Started.."

mongo --host ${MONGODB}:27017 <<EOF
    use local
    rs.initiate()
EOF
cd /

# mongorestore -h ${MONGODB}:27017 -d percp_scope_1 /dump_backup_1 --noIndexRestore
# mongorestore -h ${MONGODB}:27017 -d percp_scope_1 /dump --noIndexRestore
for file in $(ls /dump); do mongoimport -h ${MONGODB}:27017 -d percp_scope_1 /dump/$file; done