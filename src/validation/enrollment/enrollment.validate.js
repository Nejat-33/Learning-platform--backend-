import Joi from "joi";

export const Enrollmentvalidate = {
   
    createenrollment: Joi.object({
        body: Joi.object({
            batch: Joi.string().hex().length(24).required()
        })
    }),

    updateFinalGrade : Joi.object({
        body: Joi.object({
          enrollmentId: Joi.string().hex().length(24).required(),
          finalGrade: Joi.number().min(0).max(4)
        })
    })
}