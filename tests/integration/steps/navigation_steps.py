# pylint: skip-file
"""Step definitions for page navigation"""

from behave import given, when
from behave.api.async_step import async_run_until_complete

from tests.integration.steps.shared_steps import update_current_page


@given('the user navigates to the "{page_name}" page')
@when('the user navigates to the "{page_name}" page')
@async_run_until_complete
async def step_impl(context, page_name):
    """Navigates to the given tool page"""
    await navigate_to(context, page_name)


async def navigate_to(context, page):
    """Navigates to the required tool page"""
    pages = {
        "example": navigate_to_example_page,
        "no-banner": navigate_to_no_banner_page,
        "custom-link": navigate_to_custom_link_page,
    }
    await pages[page](context)


async def navigate_to_example_page(context):
    """Navigates to the Example page"""
    await context.page.goto(f'{context.test_config.get("URLs", "ui_url")}/tests/example')
    await update_current_page(context, "example")


async def navigate_to_no_banner_page(context):
    """Navigates to the No Banner page"""
    await context.page.goto(f'{context.test_config.get("URLs", "ui_url")}/tests/example/no-banner')
    await update_current_page(context, "no-banner")


async def navigate_to_custom_link_page(context):
    """Navigates to the Custom Link page"""
    await context.page.goto(f'{context.test_config.get("URLs", "ui_url")}/tests/example/custom-link')
    await update_current_page(context, "custom-link")
