/**
 * 
 * @param {string} text 
 * @param {string} indentationString 
 * 
 * @returns {string}
 */
function createDocumentationComment(text, indentationString) {
  // Add the [indentationString] to all but the first line
  return text.trim().split("\n").map((line, index) => ((index > 0) ? `${indentationString}` : ``) + `/// ${line}`).join("\n")
}

Pulsar.registerFunction("createDocumentationComment", createDocumentationComment)

/**
 * This retrieves tokens specifically for components using the [componentType] parameter.
 * 
 * @param {string} tokens
 * @param {string} componentType
 * 
 * @returns {Array}
 */
Pulsar.registerFunction('getComponentTokens', function (tokens, componentType) {
  if (componentType) {
    const componentTypes =
      tokens.at(0)?.properties?.find((prop) => prop?.codeName === 'component')
        ?.options ?? []

    const currentComponentId =
      componentTypes.find((prop) => prop?.name === componentType)?.id ?? ''

    return tokens.filter((token) => {
      return token?.propertyValues?.component === currentComponentId
    })
  } else {
    return tokens.filter((token) => {
      return token?.propertyValues?.component === undefined
    })
  }
})

/**
 * This formats a token name into a compatible Swift variable to be used for token keys
 * or token values.
 * 
 * @param {string} token
 * @param {Object} tokenGroup
 * 
 * @returns {string}
 */
Pulsar.registerFunction('readableSwiftVariableName', function (token, tokenGroup) {
  const segments = [...tokenGroup.path]

  if (!tokenGroup.isRoot) {
    segments.push(tokenGroup.name)
  }

  segments.push(token.name)

  let sentence = segments.join(' ')

  // Return camelcased string from all segments
  sentence = sentence
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())

  // only allow letters, digits, underscore
  sentence = sentence.replace(/[^a-zA-Z0-9_]/g, '_')

  // prepend underscore if it starts with digit
  if (/^\d/.test(sentence)) {
    sentence = '_' + sentence
  }

  if (sentence.length > 0) {
    return sentence[0].toUpperCase() + sentence.slice(1)
  } else {
    return ""
  }
})

/**
 * Returns a list of tokens that do not have a component property associated with them.
 */
Pulsar.registerFunction('filterOutComponentTokens', function (tokens) {
  return tokens.filter((token) => (token.propertyValues.component === undefined))
})