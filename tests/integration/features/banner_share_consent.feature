Feature: Banner share consent

  Scenario: Internal link click without consent does not append tracking parameter
    Given the user navigates to the "custom-link" page
    When the user clicks the Internal Link link
    Then the NHSUK homepage is displayed

  Scenario: Internal link click when analytics consent is given appends tracking parameter
    Given the user navigates to the "custom-link" page
    When the user chooses to "allow" analytics cookies
    And the user clicks the Internal Link link
    Then the NHSUK homepage is displayed with shared consent query string value of 1

  Scenario: Internal link click when consent is given appends tracking parameter
    Given the user navigates to the "custom-link" page
    When the user chooses to "deny" analytics cookies
    And the user clicks the Internal Link link
    Then the NHSUK homepage is displayed with shared consent query string value of 0

  Scenario: External link without consent does not append tracking parameter
    Given the user navigates to the "custom-link" page
    When the user clicks the External Link link
    Then the external page is displayed

  Scenario: External link when analytics consent is given does not append tracking parameter
    Given the user navigates to the "custom-link" page
    When the user chooses to "allow" analytics cookies
    And the user clicks the External Link link
    Then the external page is displayed

  Scenario: External link when consent is given does not append tracking parameter
    Given the user navigates to the "custom-link" page
    When the user chooses to "deny" analytics cookies
    And the user clicks the External Link link
    Then the external page is displayed
