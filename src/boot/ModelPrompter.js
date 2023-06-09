// Adds common classes to a helper object for easy access
import store from '/src/store/db.js'
import { boot } from 'quasar/wrappers'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

import {debounce, throttle} from 'quasar'

export default boot(async ({ app }) => {

  globalThis.mp = await {
    util: {
      throttle,
      debounce,
    },
    store,
    env: {
      LOGO_SMALL: process.env.LOGO_SMALL,
      LOGO_TITLE: process.env.LOGO_TITLE,
      LOGO_FAVICON: process.env.LOGO_FAVICON,
      LOGO_RELEASE: process.env.LOGO_RELEASE,
    }
  }

  globalThis.MonacoEnvironment = {
    getWorker(_, label) {
      if (label === 'json') {
        return new jsonWorker();
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        return new cssWorker();
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return new htmlWorker();
      }
      if (label === 'typescript' || label === 'javascript') {
        return new tsWorker();
      }
      return new editorWorker();
    },
  }

  /**
   * Listen to video-container-mask clicks to start the player
   */
  document.addEventListener('click', (ev) => {
    // Check if the clicked element has the class "classname"
    if (ev.target.classList.contains('video-container-mask')) {
      const $video = ev.target.parentNode.querySelector('video')
      $video.play()
      $video.classList.add('started')
    }
  })
})
