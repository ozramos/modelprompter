// This file is not actually used as a boot file
// Import it instead of the library to use it
import MarkdownIt from 'markdown-it'

// @see https://markdown-it-mermaid.readthedocs.io/en/latest/
import mermaidPlugin from '@agoose77/markdown-it-mermaid'

import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  // breaks: true,
  allowScripts: true,

  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
        '</code></pre>'
      } catch (__) {}
    }

    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
  }
})

md.use(mermaidPlugin, { theme: "dark" })

export default md
