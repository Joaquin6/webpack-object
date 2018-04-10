import Joi from 'joi'
import { absolutePath } from '../../types'
import { noRootFilesNodeModulesNameClash } from '../../rules'

export default ({ rules }) => {
  const rootDir = rules['no-root-files-node-modules-nameclash']
    ? absolutePath.concat(noRootFilesNodeModulesNameClash) : absolutePath

  // console.log('\n\trootDir => ', rootDir);

    // root: Joi.array().items(
    //   rules['no-root-files-node-modules-nameclash']
    //   ? absolutePath.concat(noRootFilesNodeModulesNameClash)
    //   : absolutePath
    // ).single(),
    //
  return Joi.object({
    alias: Joi.object().pattern(/.+/, Joi.string()),
    modules: Joi.array().items(
      Joi.string(),
      rootDir,
    ),
    extensions: Joi.array().items([Joi.string().regex(/\..+/), Joi.string().min(2)]),
    mainFields: Joi.array(),
    aliasFields: [Joi.string(), Joi.array()],
    unsafeCache: [
      Joi.array().items(Joi.object().type(RegExp)).single(),
      Joi.boolean().valid(true),
    ],
    plugins: Joi.array().optional(),
  })
}

