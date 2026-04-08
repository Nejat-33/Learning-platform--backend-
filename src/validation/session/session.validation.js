import Joi from "joi";

export const sessionValidation = {
    createSeesion: Joi.object({
        batch: Joi.string().required(),
        instructor: Joi.string().required(),
        qrCoodeToken: Joi.string().min(5).required(),
        isActive: Joi.boolean(),
        date: Joi.date()
    })
}