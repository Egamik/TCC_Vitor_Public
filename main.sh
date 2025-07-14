#!/bin/bash
PROJECT_ROOT=$(pwd)
GROUP=$(id -g)
RED='\033[0;31m'
NC='\033[0m' # No Color

while getopts 'b' flag; do
    case "${flag}" in
    b) build=true ;;
    *) print_options
        exit 1 ;;
    esac
done

# Clean minifab folders
echo -e "${RED}Cleaning minifab folders${NC}"
rm -rf $PROJECT_ROOT/minifabric/chaincode/*
rm -rf $PROJECT_ROOT/minifabric/app/*

# Copy files to minifab folder
echo -e "${RED}Copying chaincodes to minifab folder${NC}"
cp -r $PROJECT_ROOT/chaincode/accesslist $PROJECT_ROOT/minifabric/chaincode/
cp -r $PROJECT_ROOT/chaincode/ehr $PROJECT_ROOT/minifabric/chaincode/

# Prepare API package
echo -e "${RED}Copying API files to minifab folder${NC}"
cd $PROJECT_ROOT/api
npm run build
cd $PROJECT_ROOT

cp -r $PROJECT_ROOT/api/build $PROJECT_ROOT/minifabric/app/api
cp -r $PROJECT_ROOT/api/node_modules $PROJECT_ROOT/minifabric/app/api/

cd $PROJECT_ROOT/minifabric

if [ "$build" = true ]; then
    echo -e "${RED}Construindo imagem labsec/minifab ${NC}"
    docker build -t labsec/minifab .
fi

echo -e "${RED}Bringing network Up!${NC}"

./minifab netup -e true

sudo chown -R $USER:$GROUP $PROJECT_ROOT/minifabric/vars

echo -e "${RED}Setting up channel!${NC}"

./minifab create,join,anchorupdate,profilegen -c 'jornada-channel'

echo -e "${RED}Installing chaincodes!${NC}"

./minifab ccup -l go -n accesslist -r false

./minifab ccup -l go -n ehr -r true


echo -e "${RED}Initializing API!${NC}"

./minifab app -a api
