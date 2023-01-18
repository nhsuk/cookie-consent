from selenium.webdriver.common.by import By
from uitestcore.page import BasePage
from uitestcore.page_element import PageElement


class Qualtrics(BasePage):
    def __init__(self, browser, logger):
        super().__init__(browser, logger)

    def clear_cookies(self, context):
        self.interact.clear_all_cookies()
        self.driver.refresh()

    def navigate_to_page(self, context):
        self.logger.log(20, "Open page with Qualtrics intercept")
        self.interact.open_url(context.url)
        return self.interrogate.is_element_visible(PageElement(By.TAG_NAME, 'main'))

    # accept_cookies takes in a boolean "accept", where True clicks the allow button and False clicks the decline button
    def accept_cookies(self, context, accept):
        if accept:
            self.logger.log(20, "Accept cookies on the cookie consent banner")
            cookies_button = PageElement(By.ID, "nhsuk-cookie-banner__link_accept_analytics")
        else:
            self.logger.log(20, "Decline cookies on the cookie consent banner")
            cookies_button = PageElement(By.ID, "nhsuk-cookie-banner__link_accept")
        self.interact.click_element(cookies_button)
        self.wait.for_page_to_load()

    def find_qualtrics_intercept_button(self, context):
        self.logger.log(20, "Finding the Qualtrics intercept button")
        return self.find.element(PageElement(By.CLASS_NAME, "QSIFeedbackButton"))

    def click_qualtrics_intercept_button(self, context):
        self.logger.log(20, "Click on the Qualtrics intercept button")
        qualtrics_button = PageElement(By.ID, "QSIFeedbackButton-btn")
        self.interact.click_element(qualtrics_button)
        self.wait.for_page_to_load()

    def find_qualtrics_intercept_content(self, context):
        self.logger.log(20, "Find Qualtrics intercept content")
        return self.find.element(PageElement(By.ID, "survey-canvas"))
