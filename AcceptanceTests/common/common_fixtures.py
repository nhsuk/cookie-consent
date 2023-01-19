from behave import fixture


@fixture
def skip_execution_if_not_running_in_beta(context, scenario):
    beta_url = getattr(context, "beta_url")

    if not (beta_url in context.url or beta_url in context.browser.current_url):
        scenario.skip("Skipped run against non-beta environment when tagged with @fixture.OnlyBeta")


@fixture
def skip_execution_if_running_in_beta(context, scenario):
    beta_url = getattr(context, "beta_url")

    if beta_url in context.url or beta_url in context.browser.current_url:
        scenario.skip("Skipped run against Beta when tagged with @fixture.NotBeta")


@fixture
def skip_execution_if_running_against_live_environment(context, scenario):
    """
    Skip the current scenario if we are running against the Live URL
    https://stackoverflow.com/a/42721605
    :param context: the test context instance
    :param scenario: the Behave scenario instance
    """
    # Get the live and beta URLs, ensuring there are no errors if these don't exist on the context
    live_url = getattr(context, "live_url", "")
    beta_url = getattr(context, "beta_url", "")

    if context.url in [live_url, beta_url] or context.browser.current_url in [live_url, beta_url]:
        scenario.skip("Skipped run against Live when tagged with @fixture.NoRunInLive")
