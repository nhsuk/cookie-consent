@qualtrics
#noinspection CucumberUndefinedStep
Feature: Qualtrics intercept is displayed on a page
"""
As a user of the NHS.UK website, I expect the Qualtrics intercept to be visible when I accept cookies
"""

    Scenario: The Qualtrics intercept is visible when I accept cookies in the cookie consent banner
      Given I navigate to a page with a Qualtrics intercept
      When I accept the cookies on the cookie consent banner
      Then The Qualtrics intercept button is visible

    Scenario: The Qualtrics intercept survey content is visible when I click on the Qualtrics intercept button
      Given I navigate to a page with a Qualtrics intercept
      When I accept the cookies on the cookie consent banner
      And I click on the Qualtrics intercept button
      Then The Qualtrics intercept survey content is visible

    Scenario: The Qualtrics intercept is not visible when I decline cookies in the cookie consent banner
      Given I navigate to a page with a Qualtrics intercept
      When I decline the cookies on the cookie consent banner
      Then The Qualtrics intercept button is not visible