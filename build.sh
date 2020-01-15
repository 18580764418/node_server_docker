#!/bin/bash
cp -r ../app.js .
cp -r ../checkLogin.js .
cp -r ../package-lock.json .
cp -r ../package.json .
cp -r ../routers .
cp -r ../schema .
cp -r ../public .
docker build -t server_node:0.0.1 .
docker rmi $(docker images -f "dangling=true" -q)
