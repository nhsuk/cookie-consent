Feature: Broadcast cookie consent share consent

  Scenario: Same domain link click without consent does not append tracking parameter
    Given the user navigates to the "custom-link" page
    When the user clicks the "Cookie Settings Link" link
    Then the page is displayed and does not contain shared consent query string

  Scenario: Same domain link click when analytics consent is given does not append tracking parameter
    Given the user navigates to the "custom-link" page
    When the user chooses to "allow" analytics cookies
    And the user clicks the "Cookie Settings Link" link
    Then the page is displayed and does not contain shared consent query string

  Scenario: Same domain link click when analytics consent is denied does not append tracking parameter
    Given the user navigates to the "custom-link" page
    When the user chooses to "deny" analytics cookies
    And the user clicks the "Cookie Settings Link" link
    Then the page is displayed and does not contain shared consent query string

  Scenario Outline: Authorized domain does not broadcast when no consent is given
    Given the user navigates to the "custom-link" page
    When the user clicks the "<link_text>" link
    Then the page is displayed and does not contain shared consent query string
    Examples:
      | link_text                     |
      | NHS UK Link                   |
      | Organisation NHS Website Link |
      | NHS App Service Link          |
      | Access Login NHS Link         |

  Scenario Outline: Authorized domain broadcasts consent when analytics is accepted
    Given the user navigates to the "custom-link" page
    When the user chooses to "allow" analytics cookies
    And the user clicks the "<link_text>" link
    Then the page is displayed and contains shared consent query string value of 1
    Examples:
      | link_text                     |
      | NHS UK Link                   |
      | Organisation NHS Website Link |
      | NHS App Service Link          |
      | Access Login NHS Link         |

  Scenario Outline: Authorized domain broadcasts consent when analytics is denied
    Given the user navigates to the "custom-link" page
    When the user chooses to "deny" analytics cookies
    And the user clicks the "<link_text>" link
    Then the page is displayed and contains shared consent query string value of 0
    Examples:
      | link_text                     |
      | NHS UK Link                   |
      | Organisation NHS Website Link |
      | NHS App Service Link          |
      | Access Login NHS Link         |

  Scenario: Unauthorised link without consent does not append tracking parameter
    Given the user navigates to the "custom-link" page
    When the user clicks the "Unauthorised Link" link
    Then the page is displayed and does not contain shared consent query string

  Scenario: Unauthorised link when analytics consent is given does not append tracking parameter
    Given the user navigates to the "custom-link" page
    When the user chooses to "allow" analytics cookies
    And the user clicks the "Unauthorised Link" link
    Then the page is displayed and does not contain shared consent query string

  Scenario: Unauthorised link when consent is denied does not append tracking parameter
    Given the user navigates to the "custom-link" page
    When the user chooses to "deny" analytics cookies
    And the user clicks the "Unauthorised Link" link
    Then the page is displayed and does not contain shared consent query string
