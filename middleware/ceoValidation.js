import Joi from 'joi';

export const ceoValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().required(),
    password: Joi.string().min(6).max(15).required(),
    phone: Joi.number().integer().min(1000000000).max(9999999999).required(),
    gender: Joi.string().valid('Male', 'Female', 'Other').required(),
    dob: Joi.date().less('now').required(),
    experience: Joi.number().integer().min(0).required(),
    position: Joi.string().optional(),
    address: Joi.string().max(255).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: 'Bad request', error: error.details });
  }

  next();
};
