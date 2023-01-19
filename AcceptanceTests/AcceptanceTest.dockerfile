FROM python:3.7-alpine3.10

WORKDIR /automation-ui

RUN apk update && apk add "curl" \
    "chromium" \
    "chromium-chromedriver"

VOLUME ["/dev/shm"]

COPY requirements.txt ./
RUN pip install -r /automation-ui/requirements.txt

COPY . ./

ARG PATH_TO_TESTS=./features
ARG BASE_URL=""

ENTRYPOINT [ "/bin/sh", "-c", "behave $PATH_TO_TESTS $BASE_URL -Dlogging_flag=true --junit --junit-directory=./report/junit/ --format=pretty " ]