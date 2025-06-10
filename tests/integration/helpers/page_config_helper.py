"""Helpers for reading page template data"""

import json


def get_page_config(page_name):
    """Gets page template data as dict"""
    page_data_file_path = "tests/integration/data/pages/%s.json"

    with open(page_data_file_path % page_name, encoding="utf-8") as file:
        return json.load(file)
