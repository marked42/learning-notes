/**
 * use babel-plugin-styled-components for server side rendering
 */
module.exports = {
    // extract styles from styled components
    processors: ["stylelint-processor-styled-components"],
    extends: [
      "stylelint-config-standard",
      // disable styleint rules that clashes with styled-components
      "stylelint-config-styled-components",
    ],
    // for nesting and interpolation support
    syntax: "scss",
  }
  