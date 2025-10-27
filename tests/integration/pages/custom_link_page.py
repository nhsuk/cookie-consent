"""Page Object for Custom Link page"""

from tests.integration.pages.base_page import BasePage


class CustomLinkPage(BasePage):
    """Custom Link page"""

    cookie_banner_link = "#nhsuk-cookie-banner__link"
    nhs_uk_link_text = "NHS UK Link"

    async def wait_until_loaded(self):
        """Waits for Example page"""
        await super().wait_until_loaded()
        await self.get_link(self.nhs_uk_link_text).wait_for()

    async def click_cookie_banner_link(self):
        """Clicks the custom cookie banner link"""
        await self.get_locator(self.cookie_banner_link).click()

    async def click_link_by_text(self, link_text):
        """Clicks a link by its text"""
        await self.get_link(link_text).click()

    async def get_link_href(self, link_text):
        """Gets the href attribute of a link by its text"""
        link = self.get_link(link_text)
        return await link.get_attribute("href")
