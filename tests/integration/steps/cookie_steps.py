# pylint: skip-file
"""Step definitions for cookies"""
import json
import re
import urllib.parse
from urllib.parse import urlparse

from behave import given, when, then
from behave.api.async_step import async_run_until_complete
from playwright.async_api import expect


@then('the cookies should contain the "{cookie_name}" cookie')
@async_run_until_complete
async def step_impl(context, cookie_name):
    """Verifies the given cookie exists"""
    cookies = await context.browser_context.cookies()
    has_cookie = any(cookie_name in cookie.get("name", "") for cookie in cookies)
    assert has_cookie == True


@then('the cookies should not contain the "{cookie_name}" cookie')
@async_run_until_complete
async def step_impl(context, cookie_name):
    """Verifies the given cookie exists"""
    cookies = await context.browser_context.cookies()
    has_cookie = any(cookie_name in cookie.get("name", "") for cookie in cookies)
    assert has_cookie == False


@when('the user chooses to "{preference}" analytics cookies')
@async_run_until_complete
async def step_impl(context, preference):
    """Clicks the given cookie banner button"""
    if preference == "allow":
        await context.current_page.click_accept_analytics_cookies_button()
    else:
        await context.current_page.click_do_not_use_analytics_cookies_button()
    await expect(context.current_page.get_cookie_confirmation_banner()).to_be_visible()


@when("the statistics cookie is to true")
@async_run_until_complete
async def step_impl(context):
    """The statistics cookie is set to true"""
    await context.current_page.page.evaluate("window.NHSCookieConsent.setStatistics(true)")
    await context.current_page.page.reload()
    await context.current_page.page.wait_for_load_state("networkidle")


@then("the cookie banner is displayed to the user")
@async_run_until_complete
async def step_impl(context):
    """Verifies the cookie banner is displayed"""
    cookie_banner = context.current_page.get_cookie_banner()
    await expect(cookie_banner).to_be_visible()
    await expect(cookie_banner).to_contain_text("We've put some small files called cookies on your device")


@then("the cookie banner is not displayed to the user")
@async_run_until_complete
async def step_impl(context):
    """Verifies the cookie banner is not displayed"""
    cookie_banner = context.current_page.get_cookie_banner()
    await expect(cookie_banner).not_to_be_visible()


@then("the cookie confirmation banner is displayed to tbe user")
@async_run_until_complete
async def step_impl(context):
    """Verifies the cookie confirmation banner is displayed"""
    confirmation_banner = context.current_page.get_cookie_confirmation_banner()
    await expect(confirmation_banner).to_be_visible()


@then("the cookie confirmation banner is not displayed to tbe user")
@async_run_until_complete
async def step_impl(context):
    """Verifies the cookie confirmation banner is not displayed"""
    confirmation_banner = context.current_page.get_cookie_confirmation_banner()
    await expect(confirmation_banner).not_to_be_visible()


@when("the user may choose to read more about our cookies")
@async_run_until_complete
async def step_impl(context):
    """Verifies the cookie policy link"""
    await expect(context.current_page.get_read_more_about_our_cookies_link()).to_have_attribute(
        "href",
        "/our-policies/cookies-policy/",
    )


@when("the user clicks the cookie banner custom link")
@async_run_until_complete
async def step_impl(context):
    """Clicks the cookie banner custom link"""
    await context.current_page.click_cookie_banner_link()


@given('the "{cookie_name}" cookie is set to "{cookie_value}"')
@async_run_until_complete
async def step_impl(context, cookie_name, cookie_value):
    """Sets the given cookie to the given value"""
    parsed_url = urlparse(context.test_config.get("URLs", "ui_url"))
    await context.browser_context.add_cookies(
        [
            {
                "name": cookie_name,
                "domain": parsed_url.hostname,
                "path": "/",
                "value": cookie_value,
            },
        ]
    )


@given('the nhsuk-cookie-consent cookie is set to full consent with version "{version}"')
@async_run_until_complete
async def step_impl(context, version):
    """Sets the nhsuk-cookie-consent cookie to full consent"""
    cookie_value = {
        "necessary": "true",
        "preferences": "true",
        "statistics": "true",
        "marketing": "true",
        "consented": "true",
        "version": version,
    }
    encoded_cookie_value = urllib.parse.quote(json.dumps(cookie_value))
    parsed_url = urlparse(context.test_config.get("URLs", "ui_url"))
    await context.browser_context.add_cookies(
        [
            {
                "name": "nhsuk-cookie-consent",
                "domain": parsed_url.hostname,
                "path": "/",
                "value": encoded_cookie_value,
            },
        ]
    )


@then('the statistics cookie is to "{value}"')
@async_run_until_complete
async def step_impl(context, value):
    """Verifies the statistics cookie has been set to the given value"""
    cookie_value = await context.current_page.page.evaluate("window.NHSCookieConsent.getStatistics()")
    assert str(cookie_value) == value


@then("the nhsuk-cookie-consent cookie is exposed as a global object")
@async_run_until_complete
async def step_impl(context):
    """Verifies the nhsuk-cookie-consent cookie is a global object"""
    cookie = await context.current_page.page.evaluate("window.NHSCookieConsent")
    assert cookie is not None


@then("the nhsuk-cookie-consent cookie has a semver version string")
@async_run_until_complete
async def step_impl(context):
    """Verify semver VERSION exists in cookie"""
    cookie = await context.current_page.page.evaluate("window.NHSCookieConsent")
    assert "VERSION" in cookie
    version = cookie.get("VERSION")
    assert re.match(r'^(\d+)\.(\d+)\.(\d+)$', version)


@when("the user clicks the Internal Link link")
@async_run_until_complete
async def step_impl(context):
    """Clicks the Internal Link link"""
    await context.current_page.click_internal_link()


@then("the NHSUK homepage is displayed")
@async_run_until_complete
async def step_impl(context):
    """Verifies the www.nhs.uk page is displayed"""
    await context.page.wait_for_url("https://www.nhs.uk/", wait_until="load")
    await expect(context.page).to_have_url("https://www.nhs.uk/")


@then("the NHSUK homepage is displayed with shared consent query string value of 1")
@async_run_until_complete
async def step_impl(context):
    """Verifies the www.nhs.uk page is displayed with shared consent set to 1"""
    await context.page.wait_for_url("https://www.nhs.uk/?nhsa.sc=1", wait_until="load")
    await expect(context.page).to_have_url("https://www.nhs.uk/?nhsa.sc=1")


@then("the NHSUK homepage is displayed with shared consent query string value of 0")
@async_run_until_complete
async def step_impl(context):
    """Verifies the www.nhs.uk page is displayed with shared consent set to 0"""
    await context.page.wait_for_url("https://www.nhs.uk/?nhsa.sc=0", wait_until="load")
    await expect(context.page).to_have_url("https://www.nhs.uk/?nhsa.sc=0")


@when("the user clicks the External Link link")
@async_run_until_complete
async def step_impl(context):
    """Clicks the IExernal Link link"""
    await context.current_page.click_external_link()

@then("the external page is displayed")
@async_run_until_complete
async def step_impl(context):
    """Verifies the www.nhs.uk page is displayed"""
    await context.page.wait_for_url("https://www.google.com/", wait_until="load")
    await expect(context.page).to_have_url("https://www.google.com/")
