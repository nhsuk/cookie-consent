import json, time

def build_cookie_properties(
    necessary: bool = False,
    preferences: bool = False,
    statistics: bool = False,
    marketing: bool = False,
    consented: bool = False,
    version: int = 7
):
    def str_to_bool(val):
        if isinstance(val, bool):
            return val
        return val.lower() in ('true' )
       
    properties = {
    "necessary": str_to_bool(necessary),
    "preferences": str_to_bool(preferences),
    "statistics": str_to_bool(statistics),
    "marketing": str_to_bool(marketing),
    "consented": str_to_bool(consented),
    "version": version
    }

    return json.dumps(properties)


async def add_cookie(
    context,
    name: str,
    value,              
    *,
    persistent: bool = True,
    days: int = 90
):
    """Adds a cookie to the browser context."""
  
    cookie_value = str(value)

    cookie = {
        "name": name,
        "url": context.test_config.get("URLs", "ui_url"), 
        "value": cookie_value,
    }
    if persistent:
        cookie["expires"] = int(time.time()) + days * 24 * 60 * 60

    await context.browser_context.add_cookies([cookie])
    