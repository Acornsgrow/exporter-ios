//  = = = = = = = = = = = = = = = = = = = = = = = = = = = =
//  Token Specific Functions
//  = = = = = = = = = = = = = = = = = = = = = = = = = = = =

/**
 * Accepts a list of tokens and returns a filtered list where tokens associated with components are removed.
 * 
 * An example of a Token object may look something like the following:
 * 
 * {
 *   "id": "f073a736-9aeb-453a-b23e-c633526b1614",
 *   "versionedId": "6018977",
 *   "brandId": "6b778030-3245-11ee-b45c-4766170d51e8",
 *   "themeId": null,
 *   "designSystemVersionId": "28302",
 *   "name": "Dark Red",
 *   "description": "",
 *   "tokenType": "Color",
 *   "origin": {...},
 *   "parent": {...},
 *   "createdAt": null,
 *   "updatedAt": "2023-10-20T20:26:31.143Z",
 *   "sortOrder": -1,
 *   "properties": [...],
 *   "propertyValues": {...},
 *   "value": {...}
 * }
 *
 */
Pulsar.registerFunction('filterOutComponentTokens', function (tokens) {
  return tokens.filter(token => token.propertyValues.component === undefined)
})

/**
 * This formats a token name into a compatible Swift variable to be used for token keys or token values.
 * 
 * An example of a TokenGroup object may look something like the following:
 * 
 * {
 *   "id": "8d9af049-8daa-482c-9f4c-4dc66549679d",
 *   "versionedId": "6872630",
 *   "brandId": "6b778030-3245-11ee-b45c-4766170d51e8",
 *   "designSystemVersionId": "28302",
 *   "name": "color",
 *   "description": "",
 *   "isRoot": false,
 *   "tokenType": "Color",
 *   "childrenIds": [...],
 *   "path": [...],
 *   "tokenIds": [...],
 *   "subgroups": [...],
 *   "parent": {...},
 *   "sortOrder": -1,
 *   "createdAt": null,
 *   "updatedAt": null
 * }
 * 
 * @param {string} token
 * @param {Object} tokenGroup
 * 
 * @returns {string}
 */
Pulsar.registerFunction('createSwiftVariableName', function (token, tokenGroup) {
  const segments = [...tokenGroup.path]

  if (!tokenGroup.isRoot) {
    segments.push(tokenGroup.name)
  }

  // If we're dealing with a Component, remove the component name from the variable name
  if (token.propertyValues.component) {
    segments.shift()
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
    return sentence
  } else {
    return ""
  }
})

//  = = = = = = = = = = = = = = = = = = = = = = = = = = = =
//  Component Token Specific Functions
//  = = = = = = = = = = = = = = = = = = = = = = = = = = = =

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

//  = = = = = = = = = = = = = = = = = = = = = = = = = = = =
//  Swift Documentation Comment Functions
//  = = = = = = = = = = = = = = = = = = = = = = = = = = = =

/**
 * Creates an in-line 'triple-slash' comment for Xcode's documentation generation.
 * 
 * @param {string} text 
 * @param {string} indentationString 
 * 
 * @returns {string}
 */
Pulsar.registerFunction("createDocumentationComment", function (text, indentationString) {
  // Add the [indentationString] to all but the first line
  return text.trim().split("\n").map((line, index) => ((index > 0) ? `${indentationString}` : ``) + `/// ${line}`).join("\n")
})
