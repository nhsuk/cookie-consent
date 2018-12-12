/*
 * Changing the type to text/javascript will not cause the script to execute.
 * We need to add a sibling and then remove the original node.
 */
function enableScript(script) {
  const newScript = script.cloneNode(true)
  const parent = script.parentElement
  newScript.setAttribute('type', 'text/javascript')
  parent.insertBefore(newScript, script)
  script.remove()
}

/*
 * Enable iframes by setting the src from the data-src attribute
 */
function enableIframe(iframe) {
  const src = iframe.getAttribute('data-src')
  iframe.setAttribute('src', src)
}

/**
 * Enable all scripts for a given data-cookieconsent category
 */
export function enableScriptsByCategory(category) {
  const scripts = document.querySelectorAll(`script[data-cookieconsent="${category}"]`)
  scripts.forEach(script => enableScript(script))
}

/**
 * Enable all iframes for a given data-cookieconsent category
 */
export function enableIframesByCategory(category) {
  const iframes = document.querySelectorAll(`iframe[data-cookieconsent="${category}"]`)
  iframes.forEach(iframe => enableIframe(iframe))
}
