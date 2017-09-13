#!/bin/sh
nohup mongod --nojournal  & 
./node_modules/grunt/bin/grunt db-reset && node server.js