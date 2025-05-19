Feature: Cookie consent

  Scenario: User has out-of-date consent
    Given the "testcookie" cookie is set to "test"
    And the nhsuk-cookie-consent cookie is set to full consent with version "0"
    When the user navigates to the "example" page
    Then the cookie banner is displayed to the user
    And the statistics cookie is to "False"
    And the cookies should not contain the "testcookie" cookie

  Scenario: User has in-date consent
    Given the "testcookie" cookie is set to "test"
    And the nhsuk-cookie-consent cookie is set to full consent with version "9999"
    When the user navigates to the "example" page
    Then the cookie banner is not displayed to the user
    And the statistics cookie is to "True"
    And the cookies should contain the "testcookie" cookie
