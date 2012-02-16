#!/bin/sh
#nohup supervisor -w server3.js server3.js 2>&1 > log/run.log &
forever start nserver.js
