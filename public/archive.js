/**
 * archive.js
 * To be embedded in "archive/x.html" pages.
 * Allows for deep redirects by accounting for a "?url" query param to be passed to wacz-exhibitor
 * For example:
 * - http://h2obeta.law.harvard.edu/222048 could redirect to
 * - https://museum.lil.tools/archive/h2obeta-law-harvard-edu.html?url=http://h2obeta.law.harvard.edu/222048
 */
const playbackIframe = document.querySelector('iframe')
const playbackOrigin = new URL(playbackIframe.src).origin

const currentUrl = new URLSearchParams(playbackIframe.getAttribute('src'))?.get('url')
const redirectUrl = new URLSearchParams(window.location.search)?.get('url')

if (redirectUrl && redirectUrl !== currentUrl) {
  new URL(redirectUrl) // Will throw if not a valid url
  let urlWasUpdated = false // We only want the url to be updated once

  // Send url update when playback is ready. 
  // We know the playback is ready when it tells us so.
  window.addEventListener("message", (e) => {
    if (urlWasUpdated === true) {
      return
    }
    
    if (e?.data && e.source === playbackIframe.contentWindow) {
      playbackIframe.contentWindow.postMessage(
        {"updateUrl": redirectUrl},
        playbackOrigin
      )

      urlWasUpdated = true
    }
  });

}
