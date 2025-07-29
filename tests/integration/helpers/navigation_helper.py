"""This module provides helper functions for navigating to URLs in Playwright tests."""


async def goto_url(context, url):
    """Safely navigate to a page, avoiding Playwright 'load' flakiness by using 'domcontentloaded'."""
    await context.page.goto(url, wait_until="domcontentloaded")
