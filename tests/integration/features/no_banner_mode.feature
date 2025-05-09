Feature: No banner mode

  Scenario: Prevents banner from showing
    Given the user navigates to the "no-banner" page
    Then the cookie banner is not displayed to the user
