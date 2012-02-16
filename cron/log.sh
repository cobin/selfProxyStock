#!/bin/sh
mv /opt/NodeWLAN/log/server.log /opt/NodeWLAN/log/server.`date +%Y%m%d -d -1day`.log
cd /opt/NodeWLAN 
kill -USR2 `cat run/server.lock`
