import Joi from 'joi';

export const hrValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(15).required(),
    phone: Joi.number().integer().min(1000000000).max(9999999999).required(), 
    position: Joi.string().valid('HR').optional().default('HR'), 
    salary: Joi.number().positive().required(),
     address: Joi.string().max(255).required(),
    gender: Joi.string().valid('Male', 'Female', 'Other').required(),
    dob: Joi.date().less('now').required(), 
   });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: 'Validation failed', error: error.details });
  }
  next();
};
