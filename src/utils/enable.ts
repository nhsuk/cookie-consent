/*
 * Changing the type to text/javascript will not cause the script to execute.
 * We need to add a sibling and then remove the original node.
 */
function enableScript(script: HTMLScriptElement): void {
  const newScript = document.createElement('script');
  newScript.text = script.text;
  newScript.setAttribute('type', 'text/javascript');
  const src = script.getAttribute('src');
  if (src) {
    newScript.setAttribute('src', src);
  }
  script.before(newScript);
  script.remove();
}

/*
 * Enable iframes by setting the src from the data-src attribute
 */
function enableIframe(iframe: HTMLIFrameElement): void {
  const src = iframe.dataset.src;
  if (src) {
    iframe.setAttribute('src', src);
  }
}

/*
 * Should a script or iframe be enabled, given it has a cookieconsent attribute
 * value `cookieConsentAttribute` and the allowed categories are `allowedCategories`
 * Returns true or false
 */
function shouldEnable(
  allowedCategories: string[],
  cookieConsentAttribute: string,
): boolean {
  const cookieConsentTypes = cookieConsentAttribute.split(',');
  for (const type of cookieConsentTypes) {
    if (!allowedCategories.includes(type)) {
      // If *any* of the cookieConsentTypes are not in the allowedCategories array, return false.
      return false;
    }
  }
  return true;
}

/**
 * Enable all scripts for a given data-cookieconsent category
 */
export function enableScriptsByCategories(categories: string[]): void {
  const scripts = document.querySelectorAll<HTMLScriptElement>(
    'script[data-cookieconsent]',
  );
  // Do not use scripts.forEach due to poor browser support with NodeList.forEach
  for (const script of scripts) {
    const cookieconsent = script.dataset.cookieconsent;
    if (cookieconsent && shouldEnable(categories, cookieconsent)) {
      enableScript(script);
    }
  }
}

/**
 * Enable all iframes for a given data-cookieconsent category
 */
export function enableIframesByCategories(categories: string[]): void {
  const iframes = document.querySelectorAll<HTMLIFrameElement>(
    'iframe[data-cookieconsent]',
  );
  // Do not use iframes.forEach due to poor browser support with NodeList.forEach
  for (const iframe of iframes) {
    const cookieconsent = iframe.dataset.cookieconsent;
    if (cookieconsent && shouldEnable(categories, cookieconsent)) {
      enableIframe(iframe);
    }
  }
}
