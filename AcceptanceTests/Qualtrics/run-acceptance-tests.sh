#!/bin/bash

### Run this script to run the find_and_compare acceptance tests
### Can pass in any parameters, such as --env "BASE_URL=-Dbase_url=https://www.nhs.uk"  or --env "TAGS=--tags=smoke"

#Set the path to the feature files from the root of the acceptance test project folder
PATH_TO_TESTS=./Qualtrics/features

#Set the path to the root of the acceptance test project folder from where you are running this file from
PATH_TO_ACCEPTANCE_TEST_ROOT=..

if [[ ! -z "$1" ]]
  then
    echo "### You provided the arguments:" "$@"
fi

cd ${PATH_TO_ACCEPTANCE_TEST_ROOT}
echo "### Running from " $(pwd)

echo "### Removing old reports"
rm -rf ./report
echo "### Removing old log files"
rm -rf ./logs
echo "### Removing old screenshots"
rm -rf ./screenshots

echo "### Building docker image"
docker build -t qualtricsacceptancetests -f AcceptanceTest.dockerfile .

echo "### Running docker image"
docker run --net bridge --env "PATH_TO_TESTS=${PATH_TO_TESTS}" $@ qualtricsacceptancetests
PASSED=$?

echo "### Copying report folder from container to host"
CONTAINER_ID=$(docker container list --all --last 1 --format "{{ .ID }}")
docker cp ${CONTAINER_ID}:/automation-ui/report ./report
echo "### Copying logs folder from container to host"
docker cp ${CONTAINER_ID}:/automation-ui/logs ./logs
echo "### Copying screenshots folder from container to host"
docker cp ${CONTAINER_ID}:/automation-ui/screenshots ./screenshots


echo "### Finished running acceptance tests"
exit ${PASSED}
