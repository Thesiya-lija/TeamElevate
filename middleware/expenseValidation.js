import Joi from 'joi';

export const expenseValidation = (req, res, next) => {
  const schema = Joi.object({
    category: Joi.string()
      .valid(
        'Office Supplies',
        'Travel',
        'Utilities',
        'Salaries',
        'Equipment',
        'Miscellaneous'
      )
      .required(), 
    amount: Joi.number()
      .positive()
      .required(),
    paid_to: Joi.string()
      .min(2)
      .max(100)
      .required(), 
    contact: Joi.string()
      .pattern(/^(\+?\d{1,4}[\s-]?)?(\d{10}|\w+@\w+\.\w{2,3})$/)
      .required(),
    date: Joi.date().required(),
    description: Joi.string()
      .max(500)
      .optional(), 
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: 'Validation failed', error: error.details });
  }

  next(); 
};
