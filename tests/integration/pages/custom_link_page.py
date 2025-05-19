"""Page Object for Custom Link page"""

from tests.integration.pages.base_page import BasePage


class CustomLinkPage(BasePage):
    """Custom Link page"""

    cookie_banner_link = "#nhsuk-cookie-banner__link"
    internal_link_text = "Internal Link"
    external_link_text = "External Link"

    async def wait_until_loaded(self):
        """Waits for Example page"""
        await super().wait_until_loaded()
        await self.get_link(self.internal_link_text).wait_for()

    async def click_cookie_banner_link(self):
        """Clicks the custom cookie banner link"""
        await self.get_locator(self.cookie_banner_link).click()

    async def click_internal_link(self):
        """Clicks the Internal Link link"""
        await self.get_link(self.internal_link_text).click()

    async def click_external_link(self):
        """Clicks the External Link link"""
        await self.get_link(self.external_link_text).click()
