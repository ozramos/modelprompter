// This file is not actually used as a boot file
// Import it instead of the library to use it
import {marked} from 'marked'

marked.use({
  gfm: true
})

export default marked