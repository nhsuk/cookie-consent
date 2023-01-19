from behave import Step
from hamcrest import assert_that

from Qualtrics.pages.qualtrics_pages import Qualtrics


@Step('I navigate to a page with a Qualtrics intercept')
def navigate_to_page(context):
    context.Qualtrics = Qualtrics(context.browser, context.logger)
    context.Qualtrics.clear_cookies(context)
    context.Qualtrics.navigate_to_page(context)


@Step('I accept the cookies on the cookie consent banner')
def accept_cookies(context):
    context.Qualtrics.accept_cookies(context, True)


@Step('I decline the cookies on the cookie consent banner')
def decline_cookies(context):
    context.Qualtrics.accept_cookies(context, False)


@Step('The Qualtrics intercept button is visible')
def assert_qualtrics_button_visible(context):
    intercept_button = context.Qualtrics.find_qualtrics_intercept_button(context)
    assert_that(intercept_button is not None, "The Qualtrics intercept is not visible")


@Step('The Qualtrics intercept button is not visible')
def assert_qualtrics_button_not_visible(context):
    intercept_button = context.Qualtrics.find_qualtrics_intercept_button(context)
    assert_that(intercept_button is None, "The Qualtrics intercept is visible")


@Step('I click on the Qualtrics intercept button')
def click_qualtrics_intercept_button(context):
    context.Qualtrics.click_qualtrics_intercept_button(context)


@Step('The Qualtrics intercept survey content is visible')
def assert_qualtrics_intercept_survey_is_visible(context):
    qualtrics_intercept_survey_content = context.Qualtrics.find_qualtrics_intercept_content(context)
    assert_that((qualtrics_intercept_survey_content is not None, "The Qualtrics survey content is not visible"))
