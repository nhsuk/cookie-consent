# pylint: skip-file
"""Step definitions for cookies"""
import json
import re
import urllib.parse
from behave import given, when, then
from behave.api.async_step import async_run_until_complete
from playwright.async_api import expect
from tests.integration.helpers.cookie_helper import (
    add_cookie,
    build_cookie_properties,
    load_analytics_cookies,
)
from pathlib import Path


@given("stale analytics cookies are present without user consent")
@when("stale analytics cookies are present without user consent")
@async_run_until_complete
async def step_impl(context):
    await context.browser_context.clear_cookies()
    """Adds stale analytics cookies"""
    expected_cookies = load_analytics_cookies()
    for cookie in expected_cookies:
        await add_cookie(context, name=cookie["name"], value=cookie["value"])

    cookies = await context.browser_context.cookies()
    cookie_names = [c["name"] for c in cookies]

    for expected_cookie in expected_cookies:
        assert (
            expected_cookie["name"] in cookie_names
        ), f"Expected '{expected_cookie['name']}' to be in cookies, but it was not found."


@given("analytics cookies are present with full user consent")
@async_run_until_complete
async def step_impl(context):
    """Adds analytics cookies with full user consent"""
    # Set full cookie consent cookie
    payload = build_cookie_properties(
        necessary=True,
        preferences=True,
        statistics=True,
        marketing=False,
        consented=True,
    )
    await add_cookie(context, "nhsuk-cookie-consent", payload)

    # Add analytics cookies
    expected_cookies = load_analytics_cookies()
    for cookie in expected_cookies:
        await add_cookie(context, name=cookie["name"], value=cookie["value"])

    # Verify cookies are set
    cookies = await context.browser_context.cookies()
    cookie_names = [c["name"] for c in cookies]
    for expected_cookie in expected_cookies:
        assert (
            expected_cookie["name"] in cookie_names
        ), f"Expected '{expected_cookie['name']}' to be in cookies, but it was not found."


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
    await context.current_page.page.evaluate(
        "window.NHSCookieConsent.setStatistics(true)"
    )
    await context.page.reload(wait_until="domcontentloaded")


@then("the cookie banner is displayed to the user")
@async_run_until_complete
async def step_impl(context):
    """Verifies the cookie banner is displayed"""
    cookie_banner = context.current_page.get_cookie_banner()
    await expect(cookie_banner).to_be_visible()
    await expect(cookie_banner).to_contain_text(
        "We use some cookies to make this website work."
    )


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


@when("the user may choose to read more information about our cookies")
@async_run_until_complete
async def step_impl(context):
    """Verifies the cookie policy link"""
    await expect(
        context.current_page.get_more_information_about_our_cookies_link()
    ).to_have_attribute(
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
    await add_cookie(context, cookie_name, cookie_value)


@given(
    'the "{cookie_name}" cookie is set statistics consent to "{value}" with version "{version}"'
)
@async_run_until_complete
async def step_impl(context, cookie_name, value, version):
    """Sets the statistics cookie to the given value with the specified version"""
    payload = build_cookie_properties(statistics=value, consented=True, version=version)
    await add_cookie(context, cookie_name, payload)


@given('the "{cookie_name}" cookie is set to full consent with version "{version}"')
@async_run_until_complete
async def step_impl(context, cookie_name, version):
    """Sets the cookie to full consent"""
    payload = build_cookie_properties(
        necessary=True,
        preferences=True,
        statistics=True,
        marketing=False,
        consented=True,
        version=version,
    )
    await add_cookie(context, cookie_name, payload)


@then('the statistics cookie is to "{value}"')
@async_run_until_complete
async def step_impl(context, value):
    """Verifies the statistics cookie has been set to the given value"""
    cookie_value = await context.current_page.page.evaluate(
        "window.NHSCookieConsent.getStatistics()"
    )
    assert str(cookie_value) == value


@then('the "{cookie_name}" session statistics cookie is set to "{value}"')
@async_run_until_complete
async def step_impl(context, cookie_name, value):
    """Verifies that the nhsuk-cookie-consent cookie is a session cookie and has the expected statistics value."""
    expected_stats = value.lower() == "true"
    cookies = await context.browser_context.cookies()

    # Find the session cookie
    for cookie in cookies:
        if cookie["name"] == cookie_name:
            consent_cookie = cookie
            break

    assert consent_cookie is not None, f"{cookie_name} cookie not found"
    assert (
        "expires" in consent_cookie and consent_cookie["expires"] == -1
    ), "Cookie should not be a session cookie"

    decoded_value = urllib.parse.unquote(consent_cookie["value"])
    parsed = json.loads(decoded_value)

    assert (
        parsed["statistics"] == expected_stats
    ), f"Expected statistics={expected_stats}, but got {parsed['statistics']}"


@then('the "{cookie_name}" cookie is not a session cookie')
@async_run_until_complete
async def step_impl(context, cookie_name):
    """Verifies that the cookie is not a session cookie."""
    cookies = await context.browser_context.cookies()

    for cookie in cookies:
        if cookie["name"] == cookie_name:
            stats_cookie = cookie
            break

    assert stats_cookie is not None, f"{cookie_name} cookie not found"
    assert (
        "expires" in stats_cookie and stats_cookie["expires"] != -1
    ), "Cookie should not be a session cookie"


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
    assert re.match(r"^(\d+)\.(\d+)\.(\d+)$", version)


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


@then("the analytics cookies are cleared")
@async_run_until_complete
async def step_impl(context):
    """Verifies that known analytics cookies have been removed"""
    cookies = await context.browser_context.cookies()
    cookie_names = [c["name"] for c in cookies]

    expected_cookies = load_analytics_cookies()
    for expected_cookie in expected_cookies:
        assert (
            expected_cookie["name"] not in cookie_names
        ), f"Expected '{ expected_cookie['name'] }' to be cleared, but it still exists"


@then("the analytics cookies are not cleared")
@async_run_until_complete
async def step_impl(context):
    """Verifies that known analytics cookies have not been removed"""
    cookies = await context.browser_context.cookies()
    cookie_names = [c["name"] for c in cookies]

    expected_cookies = load_analytics_cookies()
    for expected_cookie in expected_cookies:
        assert (
            expected_cookie["name"] in cookie_names
        ), f"Expected '{ expected_cookie['name'] }' to still exist, but it was cleared"
