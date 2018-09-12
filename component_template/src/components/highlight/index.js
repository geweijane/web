import Vue from 'vue'
import marked from 'marked'
import Hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'
let Highlight = {}
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  highlight: function (code) {
    return Hljs.highlightAuto(code).value
  }
})
Highlight.install = function (Vue, options) {
  Vue.directive('highlight', function (el) {
    let _html = el.getAttribute('content')
    _html = _html !== null ? _html : el.innerHTML
    if (_html.trim() !== '') {
      el.innerHTML = marked(_html)
      Hljs.highlightBlock(el)
    }
  })
}
Vue.use(Highlight)
