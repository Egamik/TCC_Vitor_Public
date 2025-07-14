#!/bin/bash

cd ./test/throughput

docker build -t teste-vazao .

docker run --rm --network jornadadoestudante-blockchain-dev \
    --name teste-api \
    teste-vazao