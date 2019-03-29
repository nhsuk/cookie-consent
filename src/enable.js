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

/**
 * Enable all scripts for a given data-cookieconsent category
 */
export function enableScriptsByCategory(category) {
  const scripts = document.querySelectorAll(`script[data-cookieconsent="${category}"]`);
  // Do not use scripts.forEach due to poor browser support with NodeList.forEach
  for (let i = 0; i < scripts.length; i++) {
    enableScript(scripts[i]);
  }
}

/**
 * Enable all iframes for a given data-cookieconsent category
 */
export function enableIframesByCategory(category) {
  const iframes = document.querySelectorAll(`iframe[data-cookieconsent="${category}"]`);
  for (let i = 0; i < iframes.length; i++) {
    enableIframe(iframes[i]);
  }
}
