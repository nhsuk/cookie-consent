Feature: Banner is usable

  Scenario: Should display on first page load
    Given the user navigates to the "example" page
    Then the cookie banner is displayed to the user

  Scenario: Clicking the "Reject analytics cookies" button should hide banner
    Given the user navigates to the "example" page
    When the user chooses to "deny" analytics cookies
    Then the cookie banner is not displayed to the user
    And the cookie confirmation banner is displayed to the user
    And the "example" page is displayed

  Scenario: Clicking the "Accept analytics cookies" button should hide banner
    Given the user navigates to the "example" page
    When the user chooses to "allow" analytics cookies
    Then the cookie banner is not displayed to the user
    And the cookie confirmation banner is displayed to the user
    And the "example" page is displayed

  Scenario: Clicking "More information about our cookies" should take the user to another page
    Given the user navigates to the "example" page
    When the user may choose to read more information about our cookies
