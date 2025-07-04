import Joi from 'joi'
export const signinValidation = (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(15).required(), 
    })
  
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: 'Bad request', error: error.details });
    }
    next();
  };