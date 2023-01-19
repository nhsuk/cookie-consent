import json
import logging
import os
from behave import use_fixture
from behave.model_core import Status
from uitestcore.utilities import logger_handler
from uitestcore.utilities.browser_handler import BrowserHandler

from common.common_fixtures import skip_execution_if_not_running_in_beta, \
    skip_execution_if_running_in_beta, skip_execution_if_running_against_live_environment

"""
Description:    This class is executed before any Behave code, loads the browser and reads and sets the configuration.
                It also checks to see if there are flags provided as a command line parameter to overwrite the config.
"""


def before_all(context):
    """
    This function is executed before any Behave code
    :param context: the test context instance
    """
    # Read the config file and set the values into the context dict
    test_config_file = os.environ['CONFIG_FILE'] if 'TEST_CONFIG_FILE' in os.environ else 'config/CONFIG_FILE.json'

    with open(test_config_file) as data_file:
        config = json.load(data_file)

        # Set the browser if it was not already set in the product environment
        if not hasattr(context, "browser_name"):
            context.browser_name = config['browser']

        context.implicit_wait = config['implicit_wait']
        context.logging_flag = config['logging_flag']
        context.maximize_browser = config['maximize_browser_flag']
        context.url = config['base_url']

    # Initialise the logger so that an instance of it can be passed around
    context.logger = logging.getLogger("automation-ui")

    if context.logging_flag:
        # Set logging level using commandline argument e.g. --logging-level=DEBUG
        logger_handler.init_unique_log_file_logger(level=context._config.logging_level)

    else:
        # Logging is not required do don't log anything out
        context.logger.propagate = False

    BrowserHandler.prepare_browser(context)


def before_scenario(context, scenario):
    """
    This function is executed before each scenario
    :param context: the test context instance
    :param scenario: the test scenario instance
    """
    if "fixture.NoRunInLive" in scenario.effective_tags:
        use_fixture(skip_execution_if_running_against_live_environment, context, scenario)
    if "fixture.OnlyBeta" in scenario.effective_tags:
        use_fixture(skip_execution_if_not_running_in_beta, context, scenario)
    if "fixture.NotBeta" in scenario.effective_tags:
        use_fixture(skip_execution_if_running_in_beta, context, scenario)

    context.logger.log(20, "-----------------------------------------------------------------")
    context.logger.log(20, "STARTING SCENARIO: " + scenario.name)
    context.logger.log(20, "-----------------------------------------------------------------")


def after_scenario(context, scenario):
    """
    This function is executed after each scenario
    :param context: the test context instance
    :param scenario: the test scenario instance
    """
    context.logger.log(20, "-----------------------------------------------------------------")
    context.logger.log(20, f"SCENARIO ENDED: '{scenario.name}' STATUS: {scenario.status.name}")
    context.logger.log(20, "-----------------------------------------------------------------")

    if scenario.status == Status.failed:
        BrowserHandler.take_screenshot(context.browser, scenario.name)
        BrowserHandler.move_screenshots_to_folder(scenario.name)


def after_all(context):
    """
    This function closes the browser when tests have been executed
    :param context: the test context instance
    """
    context.browser.quit()
