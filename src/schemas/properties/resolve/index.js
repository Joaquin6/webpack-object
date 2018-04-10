import Joi from 'joi'
import { absolutePath } from '../../types'
import { noRootFilesNodeModulesNameClash } from '../../rules'

export default ({ rules }) => Joi.object({
  alias: Joi.object().pattern(/.+/, Joi.string()),
  root: Joi.array().items(
    rules['no-root-files-node-modules-nameclash']
    ? absolutePath.concat(noRootFilesNodeModulesNameClash)
    : absolutePath
  ).single(),
  modules: Joi.array().items(Joi.string()),
  extensions: Joi.array().items([Joi.string().regex(/\..+/), Joi.string().valid('')]),
  mainFields: Joi.array(),
  aliasFields: Joi.object(),
  unsafeCache: [
    Joi.array().items(Joi.object().type(RegExp)).single(),
    Joi.boolean().valid(true),
  ],
})

