Feature:  Consume cookie consent share consent

  Scenario Outline: Statistics consent is set from shared consent parameter when no cookie is present
    Given the user navigates to the "custom-link" page with the "nhsa.sc" query parameter set to "<shared_consent_value>"
    Then the cookie banner is not displayed to the user
    And the "nhsuk-cookie-consent" session statistics cookie is set to "<expected_statistics_value>"
    And the "nhsa.sc" query parameter is removed from the URL
    Examples:
      | shared_consent_value | expected_statistics_value |
      | 1                    | True                      |
      | 0                    | False                     |


  Scenario Outline: Consent is not given when shared consent parameter is invalid and no cookie is present
    Given the user navigates to the "custom-link" page with the "nhsa.sc" query parameter set to "<shared_consent_value>"
    Then the cookie banner is displayed to the user
    And the "nhsa.sc" query parameter is removed from the URL
    Examples:
      | shared_consent_value |
      | -1                   |
      | 2                    |
      | abc                  |


  Scenario Outline: Statistics consent is updated from shared consent parameter when cookie is present
    Given the "testcookie" cookie is set to "test"
    And the "nhsuk-cookie-consent" cookie is set statistics consent to "<initial_statistics>" with version "7"
    And the user navigates to the "custom-link" page with the "nhsa.sc" query parameter set to "<shared_consent_value>"
    Then the "nhsuk-cookie-consent" session statistics cookie is set to "<expected_statistics>"
    And the "nhsa.sc" query parameter is removed from the URL
    Examples:
      | initial_statistics | shared_consent_value | expected_statistics |
      | False              | 1                    | True                |
      | True               | 0                    | False               |


  Scenario Outline: Statistics consent is not updated from shared consent parameter when cookie is present and matching
    Given the "testcookie" cookie is set to "test"
    And the "nhsuk-cookie-consent" cookie is set statistics consent to "<existing_statistics>" with version "7"
    And the user navigates to the "custom-link" page with the "nhsa.sc" query parameter set to "<shared_consent_value>"
    Then the statistics cookie is to "<expected_statistics>"
    And the "nhsuk-cookie-consent" cookie is not a session cookie
    And the "nhsa.sc" query parameter is removed from the URL

    Examples:
      | existing_statistics | shared_consent_value | expected_statistics |
      | True                | 1                    | True                |
      | False               | 0                    | False               |
      | False               | abc                  | False               |
      | True                | 1                    | True                |
      | False               | 0                    | False               |
      | True                | -1                   | True                |



