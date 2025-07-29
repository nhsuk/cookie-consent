# pylint: skip-file
"""Step definitions shared amongst features"""

import re
from importlib import import_module

from behave import then
from behave.api.async_step import async_run_until_complete
from playwright.async_api import expect

from tests.integration.helpers import page_config_helper as pages


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
