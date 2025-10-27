#!/bin/bash

usage_print() {
  echo -e "Usage: ./run-integration-tests.sh"
}
    

export env="local"
export parallel_processes=5
export parallel_scheme=scenario
export logging_level="INFO"
export PW_TEST_SCREENSHOT_NO_FONTS_READY="1" # Disable screenshot fonts

status=0

echo "Input parameters:"
echo "- Environment: $env"
echo "- Parallel processes: $parallel_processes"
echo "- Parallel scheme: $parallel_scheme"
echo -e "- Logging level: $logging_level \n"

python -m venv venv
source ./venv/bin/activate

pip install --upgrade pip
pip install uv==0.1.45
uv pip install -r tests/integration/requirements.txt

playwright install --with-deps chromium
rm -rf tests/integration/reports

echo "### Started E2E tests"
behavex ./tests/integration --tags=~@wip --logging-level=${logging_level} --parallel-processes=${parallel_processes} --parallel-scheme=${parallel_scheme} --show-progress-bar -o ./tests/integration/reports --formatter=behavex.outputs.formatters.allure_behavex_formatter:AllureBehaveXFormatter --formatter-outdir=allure-reports
PASSED=$?

deactivate

echo "### Finished running tests!"

exit ${PASSED}
