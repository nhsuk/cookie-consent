#!/bin/bash

### When running automated test jobs in Azure, we've seen that the build agent can't always "see" the target URL.
### When this happens, each individual test will try to run and timeout. The issue with that is the timeout is 30 seconds.
### If the test pack contains 100 tests that means the build will be running for 50 minutes.
### That causes the other jobs to wait and delays other peoples work.
### This has the potential to block deployments.
### Chris Midgley suggested that if the agent can't see the URL then the tests should be skipped and the build failed fast.
### 2019/06/04 now expects basic auth username and password to be passed in to resolve test environments

if [[ ! -z "$1" ]]
  then
    echo "### You provided the arguments:" "$@"
    echo "### Setting first argument as target URL with https:// added"
    TARGET_URL="https://"$1
    echo $TARGET_URL
    AUTH_USERNAME=$2
    AUTH_PASSWORD=$3
fi

echo '### Checking my own IP address'
IP=$(curl -s ifconfig.me)
echo $IP

echo '### Checking URL access'
PYTHON_SCRIPT='
from urllib import request;
password_mgr = request.HTTPPasswordMgrWithDefaultRealm();
password_mgr.add_password(None, "'${TARGET_URL}'", "'${AUTH_USERNAME}'", "'${AUTH_PASSWORD}'");
handler = request.HTTPBasicAuthHandler(password_mgr);
opener = request.build_opener(handler);
request.install_opener(opener);
response = request.urlopen(request.Request("'${TARGET_URL}'", headers={"User-Agent": "Mozilla/5.0"}));
print(f"Status Code was {response.code}");
'
docker run --rm python:3.7-alpine3.9 python3 -c "$PYTHON_SCRIPT"
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
    echo "### Couldn't resolve target url: ${TARGET_URL}"
    echo "### Failing the build to prevent tests attempting to run"
    exit $EXIT_CODE;
fi
