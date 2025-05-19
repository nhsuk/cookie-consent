Feature: Remember cookie state

  Scenario: Clicking "Do not use analytics cookies" should prevent banner if revisited
    Given the user navigates to the "example" page
    When the user chooses to "deny" analytics cookies
    And the user navigates to the "example" page
    Then the cookie banner is not displayed to the user
    And the cookie confirmation banner is not displayed to tbe user

  Scenario: Clicking "I'm OK with analytics cookies" accept button should prevent banner if revisited
    Given the user navigates to the "example" page
    When the user chooses to "deny" analytics cookies
    And the user navigates to the "example" page
    Then the cookie banner is not displayed to the user
    And the cookie confirmation banner is not displayed to tbe user
