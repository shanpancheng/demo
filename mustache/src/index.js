import parseTemplateToTokens from './parseTemplateToTokens'

window.Mustache = {
  render(templateStr, data) {
    const tokens = parseTemplateToTokens(templateStr);
    console.log(tokens);
  }
}