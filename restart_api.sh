#!/bin/bash

PROJECT_ROOT=$(pwd)

cd $PROJECT_ROOT/api

npm run build

cp -r ./node_modules ./build

cd $PROJECT_ROOT

cp -r ./api/build ./minifabric/vars/app/api
cp -r ./api/build ./minifabric/app/api

cd $PROJECT_ROOT/minifabric

./minifab app -a api