"""Sets up the environment for use including browsers and browser config"""

import logging
import os
from pathlib import Path

from axe_playwright_python.async_playwright import Axe
from behave.api.async_step import async_run_until_complete
from behavex_images import image_attachments
from behavex_images.image_attachments import AttachmentsCondition
from playwright.async_api import async_playwright

from tests.integration.helpers import config_helper


@async_run_until_complete
async def before_all(context):
    """Executes before the whole test suite"""
    context.test_environment = os.environ["env"]
    context.test_config = config_helper.get_config(context.test_environment)

    context.axe_reporting = context.test_config.getboolean(
        "A11Y", "generate_reports", fallback=False
    )
    context.browser_name = context.test_config.getboolean(
        "BROWSER", "browser_name", fallback="chromium"
    )
    context.playwright_tracing = context.test_config.getboolean(
        "LOGGING", "playwright_tracing", fallback=False
    )

    image_attachments.set_attachments_condition(context, AttachmentsCondition.ALWAYS)

    context.playwright = await async_playwright().start()
    context.browser = await context.playwright[context.browser_name].launch(
        headless=context.test_config.getboolean("BROWSER", "headless", fallback=False),
        slow_mo=context.test_config.getint("BROWSER", "slow_mo", fallback=0),
    )

    logging_level = os.getenv("LOGGING_LEVEL", "INFO").upper()

    handler = logging.StreamHandler()
    handler.setLevel(logging_level)

    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    handler.setFormatter(formatter)

    context.LOGGER = logging.getLogger("functional_tests")
    context.LOGGER.setLevel(logging_level)
    context.LOGGER.addHandler(handler)

    context.LOGGER.debug(f"Running before_all - {id(context)}")


@async_run_until_complete
async def before_feature(context, feature):  # pylint: disable=[unused-argument]
    """Executes before each feature"""
    for tag in feature.tags:
        for scenario in feature.scenarios:
            scenario.tags.append(tag)

    if f"not.{os.environ['env']}" in feature.tags:
        feature.skip(f"Marked with @not.{os.environ['env']}")


@async_run_until_complete
async def before_scenario(context, scenario):
    """Executes before each test scenario"""
    context.scenario_name = scenario.name

    for tag in context.feature.tags:
        scenario.tags.append(tag)

    if f"not.{os.environ['env']}" in scenario.tags:
        scenario.skip(f"Marked with @not.{os.environ['env']}")
        return

    if "widget" in scenario.tags:
        context.LOGGER.debug("Widget mode")
        context.widget_mode = True
        widget_url = context.test_config.get("URLs", "widget_url")
        context.test_config.set("URLs", "ui_url", widget_url)
    else:
        context.LOGGER.debug("Standard application mode")
        context.widget_mode = False

    auth_username = context.test_config.get("USER", "user", fallback=None)
    auth_password = context.test_config.get("USER", "password", fallback=None)
    context.browser_context = await context.browser.new_context(
        java_script_enabled=("noJS" not in scenario.tags),
        http_credentials=(
            {"username": auth_username, "password": auth_password}
            if auth_username and auth_password
            else None
        ),
    )
    if context.playwright_tracing:
        try:
            await context.browser_context.tracing.start(
                screenshots=True, snapshots=True
            )
        except Exception as e:
            context.LOGGER.error(f"Error starting playwright tracing {e}")
            context.playwright_tracing = False

    context.page = await context.browser_context.new_page()
    await context.page.goto(context.test_config.get("URLs", "ui_url"))
    context.LOGGER.debug(
        f"Running before_scenario: {id(context.browser_context)} - {scenario.name}"
    )


@async_run_until_complete
async def before_step(context, step):  # pylint: disable=[unused-argument]
    """Executes before each individual step"""
    context.LOGGER.debug(
        f"Running before_step: {id(context.browser_context)} - {step.name}"
    )


@async_run_until_complete
async def after_step(context, step):  # pylint: disable=[unused-argument]
    """Executes after each individual step"""
    context.LOGGER.debug(
        f"Running after_step: {id(context.browser_context)} - {step.name} - {step.status}"
    )
    if step.status == "failed":
        screenshot = await context.page.screenshot(full_page=True, scale="css")
        image_attachments.attach_image_binary(
            context=context,
            image_binary=screenshot,
            header_text=f"Failed - {step.name}",
        )
    if step.step_type == "then" and "no-screenshot" not in context.scenario.tags:
        screenshot = await context.page.screenshot(full_page=True, scale="css")
        image_attachments.attach_image_binary(
            context=context,
            image_binary=screenshot,
            header_text=step.name,
        )


@async_run_until_complete
async def after_scenario(context, scenario):
    """Executes after each scenario"""
    if (
        not context.widget_mode
        and "axe" in context.scenario.tags
        and context.axe_reporting
    ):
        context.axe = Axe()
        element_filter = {
            "exclude": [
                ["#nhsuk-cookie-banner"],
                [".nhsuk-skip-link"],
                ["#nhsuk-skip-link"],
                [".brightcove-react-player-loader"],
                ["#brightcove-react-player-loader"],
                [".app-global-alert"],
                [".nhsuk-back-link"],
            ]
        }
        options = {
            "runOnly": {
                "type": "tag",
                "values": [
                    "wcag2a",
                    "wcag2aa",
                    "best-practice",
                ],
            }
        }
        axe_results = await context.axe.run(
            page=context.page, context=element_filter, options=options
        )
        if len(axe_results.response["violations"]) > 0:
            Path("axe_reports").mkdir(parents=True, exist_ok=True)
            axe_results.save_to_file(
                file_path="axe_reports/violations.json",
                violations_only=True,
            )

    try:
        if context.playwright_tracing and scenario.status == "failed":
            filename = scenario.name.replace(" ", "_")
            await context.browser_context.tracing.stop(
                path=f"tests/integration/traces/{filename}.zip"
            )
    except Exception as e:
        context.LOGGER.error(f"Error stopping or saving playwright tracing {e}")

    if hasattr(context, "page"):
        await context.page.close()
    if hasattr(context, "browser_context"):
        await context.browser_context.close()
    context.LOGGER.debug(
        f"Running after_scenario: {id(context.browser_context)} - {scenario.name} - {scenario.status}"
    )


@async_run_until_complete
async def after_all(context):
    """Executes after the whole test suite"""
    try:
        if hasattr(context, "browser"):
            await context.browser.close()
        if hasattr(context, "playwright"):
            await context.playwright.stop()
    except Exception as e:
        context.LOGGER.error(f"Error during cleanup: {e}")
