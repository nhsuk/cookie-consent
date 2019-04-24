/*
 * Changing the type to text/javascript will not cause the script to execute.
 * We need to add a sibling and then remove the original node.
 */
function enableScript(script) {
  const newScript = document.createElement('script');
  newScript.text = script.text;
  const parent = script.parentElement;
  newScript.setAttribute('type', 'text/javascript');
  const src = script.getAttribute('src');
  if (src) {
    newScript.setAttribute('src', src);
  }
  parent.insertBefore(newScript, script);
  parent.removeChild(script);
}

/*
 * Enable iframes by setting the src from the data-src attribute
 */
function enableIframe(iframe) {
  const src = iframe.getAttribute('data-src');
  iframe.setAttribute('src', src);
}

/*
 * Should a script or iframe be enabled, given it has a cookieconsent attribute
 * value `cookieConsentAttribute` and the allowed categories are `allowedCategories`
 * Returns true or false
 */
function shouldEnable(allowedCategories, cookieConsentAttribute) {
  const cookieConsentTypes = cookieConsentAttribute.split(',');
  for (let i = 0; i < cookieConsentTypes.length; i++) {
    if (allowedCategories.indexOf(cookieConsentTypes[i]) === -1) {
      // If *any* of the cookieConsentTypes are not in the allowedCategories array, return false.
      return false;
    }
  }
  return true;
}

/**
 * Enable all scripts for a given data-cookieconsent category
 */
export function enableScriptsByCategories(categories) {
  const scripts = document.querySelectorAll('script[data-cookieconsent]');
  // Do not use scripts.forEach due to poor browser support with NodeList.forEach
  for (let i = 0; i < scripts.length; i++) {
    const cookieconsent = scripts[i].getAttribute('data-cookieconsent');
    if (shouldEnable(categories, cookieconsent)) {
      enableScript(scripts[i]);
    }
  }
}

/**
 * Enable all iframes for a given data-cookieconsent category
 */
export function enableIframesByCategories(categories) {
  const iframes = document.querySelectorAll('iframe[data-cookieconsent]');
  // Do not use iframes.forEach due to poor browser support with NodeList.forEach
  for (let i = 0; i < iframes.length; i++) {
    const cookieconsent = iframes[i].getAttribute('data-cookieconsent');
    if (shouldEnable(categories, cookieconsent)) {
      enableIframe(iframes[i]);
    }
  }
}
