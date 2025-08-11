"""Page Object for common locators and interactions"""

from abc import abstractmethod

from playwright.async_api import Page


class BasePage(Page):
    """Members of this class may be useful across the whole journey"""

    cookie_banner = ".nhsuk-cookie-banner"
    cookie_confirmation_banner = "#nhsuk-cookie-confirmation-banner"
    more_information_about_our_cookies_link = "More information about our cookies"
    im_ok_with_analytics_cookies_button = "Accept analytics cookies"
    do_not_use_analytics_cookies_button = "Reject analytics cookies"

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

    def get_more_information_about_our_cookies_link(self):
        """Return the More information about our cookies link"""
        return self.get_link(self.more_information_about_our_cookies_link)

    def get_cookie_confirmation_banner(self):
        """Returns the cookie confirmation banner"""
        return self.get_locator(self.cookie_confirmation_banner)

    async def click_accept_analytics_cookies_button(self):
        """Clicks Accept analytics cookies button"""
        await self.get_button(self.im_ok_with_analytics_cookies_button).click()

    async def click_do_not_use_analytics_cookies_button(self):
        """Clicks Reject analytics cookies button"""
        await self.get_button(self.do_not_use_analytics_cookies_button).click()
