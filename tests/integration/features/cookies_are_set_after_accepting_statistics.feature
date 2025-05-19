Feature: Cookies are set after accepting statistics

  Scenario: Should load accepted cookies
    Given the user navigates to the "example" page
    When the user chooses to "deny" analytics cookies
    And the statistics cookie is to true
    Then the cookies should contain the "necessary" cookie
    And the cookies should contain the "statistics" cookie
    And the cookies should contain the "inline-js" cookie
