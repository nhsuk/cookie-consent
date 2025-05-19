"""Helper methods for parsing config"""

from configparser import ConfigParser


def get_config(environment):
    """Returns the config object for the specified environment"""
    config = ConfigParser()
    config.optionxform = str

    config_filepath = f"tests/integration/config/{environment}.ini"

    with open(config_filepath, encoding="utf-8") as config_file:
        config.read_file(config_file)

    return config
