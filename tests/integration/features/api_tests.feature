Feature: API tests

  Scenario: NHSUK Cookie Consent should be an an object
    Given the user navigates to the "example" page
    Then the nhsuk-cookie-consent cookie is exposed as a global object
    And the nhsuk-cookie-consent cookie has a semver version string
