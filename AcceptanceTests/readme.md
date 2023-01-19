# Acceptance Tests

The Qualtrics acceptance tests are run as a Python Behave test suite. This can be run 
either using a Python IDE, e.g. PyCharm, or as a container using the dockerfile container image.

## Tests

The tests can be found in the [Qualtrics/features](./Qualtrics/features) folder and are written in the 
[Gherkin feature testing language](https://behave.readthedocs.io/en/stable/gherkin.html#chapter-gherkin).

When run, the following folders are created with test run details:

 - `AcceptanceTests\logs`: Contains the log files for each test run
 - `AcceptanceTests\reports`: Contains JUnit test reports for each test run
 - `AcceptanceTests\screenshots`: Contains a browser screenshot for each failed test run.

__NOTE:__ When run using the container, the `run-acceptance-tests.sh` script clears the above folders before each test
run so previous results will be lost.

## Settings

The `AcceptanceTests\config` folder contains the settings for the tests. The [CONFIG_FILE.json](./config/CONFIG_FILE.json)
allows for the following default configuration:

| Configuration Key     | Variable Type | Default Value                                 | Description                                                                   |
|-----------------------| --- |-----------------------------------------------|-------------------------------------------------------------------------------| 
| logging_flag          | bool    | true                                          | Flag to log test run output to a file                                         |
| maximize_browser_flag | bool    | true                                          | Flag to maximise the browser when it is opened to run the test                |
| browser               | string  | chrome                                        | Browser to use. See [BrowserStackConfig.json](./config/BrowserStackConfig.json) |
| implicit_wait         | integer | 10                                            | Initial wait time for the browser to open a page before tests are run         |
| base_url              | string  | https://example-url.com                       | The URL of the webpage to run tests on.                                       |

Use `https://localhost:<port>` with the appropriate port if running against a test-app running locally.

## Python IDE Test Environment

The following guidance assumes the PyCharm Python IDE.

### Setup

1. Download the [ChromeDriver](https://chromedriver.chromium.org/) executable and copy to the 
   `AcceptanceTests/browser_executables` folder.

   __NOTE:__ For Firefox, use [geckodriver](https://github.com/mozilla/geckodriver/releases). 
   For Edge, use edge [webdriver](https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/). Be sure to 
   update the browser configuration as required.

2. Open the `AcceptanceTests` folder as a new project
3. In the _File -> Settings -> Project:AcceptanceTests_ dialogue, add the `AcceptanceTests` folder as a Content Root and 
   `venv` as am Excluded Folder
4. In the _Run -> Edit Configurations..._ dialogue, set the following:

   | Configuration Item | Value                                                                                                                       |
   |-----------------------------------------------------------------------------------------------------------------------------| --- |
   | Name              | qualtrics-appacceptance-tests                                                                                               |
   | Script path       | .\AcceptanceTests\venv\Lib\site-packages\behave\__main__.py                                                                 |
   | Parameters        | Qualtrics/features -Dbase_url=www.example_url.com -Dlogging_flag=true --junit --junit-directory=./report/junit/ --format=pretty |
   | Working directory | .\AcceptanceTests                                                                                                           |

5. Run the tests using the _Run -> Run qualtrics-acceptance-tests_ toolbar item.

## Containerised Test Environment

The following guidance assumes execution with the Docker Engine.

### Setup

Run the `run-acceptance-tests.sh` from the command line in the `AcceptanceTests\Qualtrics` folder. The Docker 
Engine must be running for this script to execute.
