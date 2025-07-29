"""This module provides helper functions for managing cookies in Playwright tests."""

import json
import time
import uuid


# pylint: disable=too-many-arguments,too-many-positional-arguments
def build_cookie_properties(
    necessary: bool = False,
    preferences: bool = False,
    statistics: bool = False,
    marketing: bool = False,
    consented: bool = False,
    version: int = 7,
):
    """Builds a JSON string representing cookie properties."""

    def str_to_bool(val):
        if isinstance(val, bool):
            return val
        return val.lower() in ("true")

    properties = {
        "necessary": str_to_bool(necessary),
        "preferences": str_to_bool(preferences),
        "statistics": str_to_bool(statistics),
        "marketing": str_to_bool(marketing),
        "consented": str_to_bool(consented),
        "version": version,
    }

    return json.dumps(properties)


async def add_cookie(
    context, name: str, value, *, persistent: bool = True, days: int = 90
):
    """Adds a cookie to the browser context."""

    cookie_value = str(value)

    cookie = {
        "name": name,
        "url": context.test_config.get("URLs", "ui_url"),
        "value": cookie_value,
    }
    if persistent:
        cookie["expires"] = int(time.time()) + days * 24 * 60 * 60

    await context.browser_context.add_cookies([cookie])


def load_analytics_cookies():
    """Loads analytics cookies from a JSON file."""
    cookie_filepath = "tests/integration/data/cookies/analytics-cookies.json"

    with open(cookie_filepath, encoding="utf-8") as f:
        cookie_names = json.load(f)

    cookies = []
    for cookie in cookie_names:
        value = str(uuid.uuid4().int)[:10]  # Simulate a random value for the cookie
        cookies.append({"name": cookie, "value": value})

    return cookies
