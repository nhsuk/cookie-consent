# Attach Screenshots

The attach-screenshots script uses the [UiTestCore attachments_api](https://github.com/nhsuk/ui-test-core/blob/master/uitestcore/utilities/attachments_api.py)
module which handles attaching files to test result records on Azure DevOps.

## DevOps Pipeline

The [attach-screenshots.sh](./attach-screenshots.sh) script will spin up a container from the [AttachScreenshots](./AttachScreenshots.dockerfile) 
dockerfile image which calls the [UiTestCore attachments_api](https://github.com/nhsuk/ui-test-core/blob/master/uitestcore/utilities/attachments_api.py) 
to attach all files in the screenshots folder to the Azure DevOps pipeline as test results.