import Joi from 'joi'
import { oneLine } from 'common-tags'

export const CONDITION_MESSAGE = oneLine`
  may be a RegExp (tested against absolute path),
  a string containing the absolute path, a function(absPath): bool,
  or an array of one of these combined with “and”.`

export const LOADERS_QUERY_MESSAGE = oneLine`
  You can only pass the \`query\` property when you specify your
  loader with the singular \`loader\` property`

const LOADER_INCLUDE_OR_EXCLUDE_MESSAGE = oneLine`!!
  Please supply \`include\` or/and \`exclude\` to narrow down which
  files will be processed by this loader.
  Otherwise it's too easy
  to process too many files, for example your \`node_modules\` (loader-enforce-include-or-exclude).
`

const LOADER_INCLUDE_REQUIRED = oneLine`
  is required. You should use \`include\` to specify which files should be processed
  by this loader. (loader-prefer-include)
`

const LOADER_EXCLUDE_FORBIDDEN = oneLine`
  should not be used. Reason: \`exclude\` makes it easy to match too many files,
  which might inadvertently slow your build down. Use \`include\` instead. (loader-prefer-include)
`

const LOADER_IN_LOADERS_MESSAGE = oneLine`
  at position {{pos}} must be a String or an Object with properties:
  "loader": (String, required),
  "query": (Object, optional)
`

const conditionSchema = Joi.array().items([
  Joi.string(),
  Joi.object().type(RegExp),
  Joi.func().arity(1),
]).single().options({ language: { array: { includesSingle: CONDITION_MESSAGE } } })

const loaderSchemaFn = ({ rules }) => {
  const useArraySchema = Joi.array().items(
    Joi.string(),
    Joi.object({
      loader: Joi.string(),
      options: Joi.object().optional(),
      query: Joi.alternatives().try(Joi.string(), Joi.object()).optional(),
    }),
  ).options({
    language: {
      array: {
        includes: LOADER_IN_LOADERS_MESSAGE,
      },
    },
  })

  let rule = Joi.object({
    test: conditionSchema.required(),
    exclude: conditionSchema,
    include: conditionSchema,
    enforce: Joi.string().optional(),
    loader: Joi.string().optional(),
    query: Joi.object().optional(),
    use: Joi.alternatives().try(Joi.string(), useArraySchema),
  })
    .xor('use', 'loader')
    .nand('use', 'query')
    .options({
      language: {
        object: {
          nand: LOADERS_QUERY_MESSAGE,
        },
      },
    })

  if (rules['loader-enforce-include-or-exclude']) {
    rule = rule
      .or('exclude', 'include')
      .label('loader')
      .options({ language: { object: { missing: LOADER_INCLUDE_OR_EXCLUDE_MESSAGE } } })
  }

  if (rules['loader-prefer-include']) {
    rule = rule.concat(Joi.object({
      include: conditionSchema.required(),
      exclude: Joi.any().forbidden(),
    })
      .options({
        language: {
          any: {
            required: LOADER_INCLUDE_REQUIRED,
            unknown: LOADER_EXCLUDE_FORBIDDEN,
          },
        },
      }))
  }

  return rule
}


export default (options) => {
  const loaderSchema = loaderSchemaFn(options)
  const loadersSchema = Joi.array().items(loaderSchema)
  return Joi.object({
    rules: loadersSchema,
    noParse: Joi.array().items(Joi.object().type(RegExp)).single(),
  })
}
