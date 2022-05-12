#!/bin/bash

# get the version number
echo Enter the version of this deployment
read VERSION

# build the docker image and push to dockerhub
sudo docker build -t khairokhatib/courserecon:$VERSION .
sudo docker push khairokhatib/courserecon:$VERSION

# ssh into the server and deploy
ssh root@165.227.34.96 "docker pull khairokhatib/courserecon:$VERSION && docker tag khairokhatib/courserecon:$VERSION dokku/api:$VERSION && dokku tags:deploy api $VERSION"