# pylint: skip-file
"""Step definitions shared amongst features"""

import re
from importlib import import_module

from behave import then
from behave.api.async_step import async_run_until_complete
from playwright.async_api import expect
import urllib

from tests.integration.helpers import page_config_helper as pages


AUTHORISED_DOMAINS = [
    "www.nhs.uk",
    "organisation.nhswebsite.nhs.uk",
    "www.nhsapp.service.nhs.uk",
    "access.login.nhs.uk",
]


@then('the "{page_name}" page is displayed')
@async_run_until_complete
async def step_impl(context, page_name):
    """Ensures correct page is being displayed with correct header and footer type"""
    await verify_page_template(context, page_name)


async def update_current_page(context, page_name, expected_path=None):
    """Updates the current page in the context"""
    page_template = pages.get_page_config(page_name)

    expected_url = f"{context.test_config.get('URLs', 'ui_url')}"
    if not context.widget_mode:
        if expected_path is not None:
            expected_url = f"{expected_url}/{expected_path}"
        elif page_template["path"] != "":
            expected_url = f"{expected_url}/{page_template['path']}"

    expected_url = re.compile(f"^{expected_url}")
    await context.page.wait_for_url(expected_url, wait_until="domcontentloaded")
    await expect(context.page).to_have_url(expected_url)

    try:
        module_path, class_name = page_template["class"].rsplit(".", 1)
        module = import_module(module_path)
        clazz = getattr(module, class_name)
        context.current_page = clazz(context.page, context.widget_mode)
    except (ImportError, AttributeError) as _:
        raise ImportError(page_template["class"])

    await context.current_page.wait_until_loaded()

    if expected_path is None:
        heading = context.current_page.get_locator("h1")
        await expect(heading).to_contain_text(page_template["heading"])


async def verify_page_template(context, page_name, expected_path=None):
    """Verifies the page template such as path, header/footer and alert banner presence"""
    await update_current_page(context, page_name, expected_path)
    page_template = pages.get_page_config(page_name)
    expected_title = page_template["title"]
    await expect(context.page).to_have_title(expected_title)


async def capture_link_response_and_click(context, link_text, href):
    """Helper to capture response and click link based on href"""
    # Determine link type
    is_authorized = (
        any(domain in href for domain in AUTHORISED_DOMAINS) if href else False
    )
    is_same_domain = href and (
        href.startswith("./")
        or href.startswith("/")
        or "localhost" in href
        or context.test_config.get("URLs", "ui_url") in href
    )

    # Determine response matcher based on link type
    if is_authorized:
        response_matcher = lambda response: any(
            domain in response.url for domain in AUTHORISED_DOMAINS
        )
    elif is_same_domain:
        response_matcher = lambda response: response.url.startswith(
            context.test_config.get("URLs", "ui_url")
        )
    else:
        response_matcher = lambda response: href in response.url

    # Capture response and click link
    async with context.page.expect_response(response_matcher) as response_info:
        await context.current_page.click_link_by_text(link_text)
    context.link_response = await response_info.value


async def verify_shared_consent_query_param(context, query_param=None):
    """Verifies the shared consent query parameter after navigation."""
    # Use the captured response to verify the URL before the shared parameter is consumed
    if query_param is None:
        assert (
            "nhsa.sc" not in context.link_response.url
        ), f"Expected no nhsa.sc parameter in response URL, but got: {context.link_response.url}"
    else:
        assert (
            query_param in context.link_response.url
        ), f"Expected {query_param} in response URL but got: {context.link_response.url}"

    # Verify domain matches
    expected_parsed = urllib.parse.urlsplit(context.link_response.url)
    current_parsed = urllib.parse.urlsplit(context.page.url)

    assert (
        expected_parsed.netloc == current_parsed.netloc
    ), f"Expected domain '{expected_parsed.netloc}', but got '{current_parsed.netloc}'"
