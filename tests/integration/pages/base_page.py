"""Page Object for common locators and interactions"""

from abc import abstractmethod

from playwright.async_api import Page


class BasePage(Page):
    """Members of this class may be useful across the whole journey"""

    cookie_banner = ".nhsuk-cookie-banner"
    cookie_confirmation_banner = "#nhsuk-cookie-confirmation-banner"
    read_more_about_our_cookies_link = "read more about our cookies"
    im_ok_with_analytics_cookies_button = "I'm OK with analytics cookies"
    do_not_use_analytics_cookies_button = "Do not use analytics cookies"

    def __init__(self, page: Page, widget_mode: bool = False):
        super().__init__(page)
        self.page = page
        self.widget_mode = widget_mode

    @abstractmethod
    async def wait_until_loaded(self):
        """Common wait for every page"""

    def get_locator(self, locator):
        """Return locator"""
        return self.page.locator(locator)

    def get_link(self, name):
        """Returns link"""
        return self.page.get_by_role("link", name=name, exact=True)

    def get_button(self, name):
        """Returns button"""
        return self.page.get_by_role("button", name=name, exact=True)

    def get_cookie_banner(self):
        """Returns the cookie banner"""
        return self.get_locator(self.cookie_banner)

    def get_read_more_about_our_cookies_link(self):
        """Return the read more about our cookies link"""
        return self.get_link(self.read_more_about_our_cookies_link)

    def get_cookie_confirmation_banner(self):
        """Returns the cookie confirmation banner"""
        return self.get_locator(self.cookie_confirmation_banner)

    async def click_accept_analytics_cookies_button(self):
        """Clicks I'm OK with analytics cookies button"""
        await self.get_button(self.im_ok_with_analytics_cookies_button).click()

    async def click_do_not_use_analytics_cookies_button(self):
        """Clicks Do not use analytics cookies button"""
        await self.get_button(self.do_not_use_analytics_cookies_button).click()
