Feature: Cookies are set on first load

  Scenario: Should load necessary cookies
    Given the user navigates to the "example" page
    Then the cookies should contain the "necessary" cookie
    Then the cookies should not contain the "statistics" cookie
    Then the cookies should contain the "nhsuk-cookie-consent" cookie
