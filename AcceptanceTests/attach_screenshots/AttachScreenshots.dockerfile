FROM python:3.7-alpine3.9

WORKDIR /screenshots

RUN apk update && apk add "git"

COPY requirements.txt ./
RUN pip install -r /screenshots/requirements.txt

COPY . ./

ARG RELEASEID=""
ARG AUTH_TOKEN=""


ENTRYPOINT [ "/bin/sh", "-c", "python attach_screenshots/attach_screenshots.py $RELEASEID $AUTH_TOKEN" ]