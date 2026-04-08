import Joi from "joi";

export const coursevalidation = {
    createCourse: Joi.object({
      title: Joi.string().required(),
      description: Joi.string(),

     durationInWeeks: Joi.number().min(1).required(),
      price: Joi.number().min(0).required(),
  
      haspreRequest: Joi.boolean().default(false),
      prerequests: Joi.string().when('hasPrerequiste', {
        is: true,
        then: Joi.required(),
        otherwise: Joi.optional()
      }),
      passingScore:  Joi.number().min(0).max(100).default(50),
      thembnail: Joi.string().uri().optional()
    }),


    updateCourse: Joi.object({
       title: Joi.string().required().optional(),
      description: Joi.string().optional(),
      duration: Joi.number().min(1).required().optional(),
      price: Joi.number().min(0).required().optional(),
      haspreRequest: Joi.boolean().default(false).optional(),
      preeequests: Joi.string().optional(),
      passingScore:  Joi.number().min(0).max(100).default(50).optional(),
      thembnail: Joi.string().uri().optional()
    }),


    deleteCourse: Joi.object({
     id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    })
}