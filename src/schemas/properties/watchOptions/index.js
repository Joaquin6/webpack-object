import Joi from 'joi'

export default Joi.object({
  aggregateTimeout: Joi.number(),
  poll: [Joi.boolean(), Joi.number()],
})
