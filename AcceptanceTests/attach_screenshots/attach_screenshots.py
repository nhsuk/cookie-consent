import sys
from uitestcore.utilities.attachments_api import attach_files

result = attach_files("nhsuk", "nhsuk.automation-ui", "screenshots", sys.argv)
sys.exit(result)
