Feature: Custom Banner URL link

  Scenario: Link to custom url
    Given the user navigates to the "custom-link" page
    When the user clicks the cookie banner custom link
    Then the "cookie-settings" page is displayed
    And the cookie banner is not displayed to the user

  Scenario: Should still display the banner on other pages
    Given the user navigates to the "custom-link" page
    When the user clicks the cookie banner custom link
    Then the "cookie-settings" page is displayed
    When the user navigates to the "custom-link" page
    Then the cookie banner is displayed to the user
