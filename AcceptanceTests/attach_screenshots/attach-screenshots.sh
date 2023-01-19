#!/bin/bash

### Run this script to attach the screenshots
### Can pass in any parameters, such as --env "RELEASEID=$(Release.ReleaseId)"

#Set the path to the root of the test project folder from where you are running this file from
PATH_TO_ROOT=.

if [ ! -z "$1" ]
  then
    echo "### You provided the arguments:" "$@"
fi

echo "### Running from " $(pwd)

echo "### Building docker image"
docker build -t screenshots -f attach_screenshots/AttachScreenshots.dockerfile .

echo "### Running docker image"
docker run $@ screenshots
PASSED=$?

echo "### Finished attaching screenshots"
exit ${PASSED}
