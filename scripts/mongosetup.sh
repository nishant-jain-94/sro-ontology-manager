#!/bin/bash

echo "Waiting for the standalone Replica Set"
sleep 10

MONGODB=`ping -c 1 mongodb | head -1  | cut -d "(" -f 2 | cut -d ")" -f 1`

until curl http://${MONGODB}:28017/serverStatus\?text\=1 2>&1 | grep uptime | head -1; do
  printf '.'
  sleep 1
done

echo curl http://${MONGODB}:28017/serverStatus\?text\=1 2>&1 | grep uptime | head -1
echo "Started.."

mongo --host ${MONGODB}:27017 <<EOF
    use local
    rs.initiate();
EOF
cd /
ls

mongorestore -h ${MONGODB}:27017 /dump --noIndexRestore

sleep 15