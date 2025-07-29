# pylint: skip-file
"""Step definitions for page navigation"""

from urllib.parse import parse_qs, urlencode, urlparse
from behave import given, when, then
from behave.api.async_step import async_run_until_complete

from tests.integration.helpers.navigation_helper import goto_url
from tests.integration.steps.shared_steps import update_current_page


@given(
    'the user navigates to the "{page_name}" page with the "{param}" query parameter set to "{value}"'
)
@when(
    'the user navigates to the "{page_name}" page with the "{param}" query parameter set to "{value}"'
)
@async_run_until_complete
async def step_impl(context, page_name, param, value):
    """Navigates to the given tool page with dynamic query parameter"""
    context.query_params = {param: value}
    await navigate_to(context, page_name)


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
    url = f'{context.test_config.get("URLs", "ui_url")}/tests/example'
    await goto_url(context, url)
    await update_current_page(context, "example")


async def navigate_to_no_banner_page(context):
    """Navigates to the No Banner page"""
    url = f'{context.test_config.get("URLs", "ui_url")}/tests/example/no-banner'
    await goto_url(context, url)
    await update_current_page(context, "no-banner")


async def navigate_to_custom_link_page(context):
    """Navigates to the Custom Link page"""
    base_url = f'{context.test_config.get("URLs", "ui_url")}/tests/example/custom-link'

    query_params = getattr(context, "query_params", None)
    if query_params:
        query_string = urlencode(query_params)
        base_url = f"{base_url}?{query_string}"

    await goto_url(context, base_url)
    await update_current_page(context, "custom-link")


@then('the "{param}" query parameter is removed from the URL')
@async_run_until_complete
async def step_impl(context, param):
    current_url = context.page.url
    parsed = urlparse(current_url)
    params = parse_qs(parsed.query)

    assert (
        param not in params
    ), f"Expected query param '{param}' to be removed, but found in URL: {current_url}"
