-#!/bin/sh
git pull origin master
apidoc -i routes/ -o doc/
pm2 restart --time --name kn-trip-sever