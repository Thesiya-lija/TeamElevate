import Joi from 'joi';

export const empValidation = (req, res, next) => {
  const schema = Joi.object({
    employeeId: Joi.string().required(),
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(15).required(),
    phone: Joi.number().integer().min(1000000000).max(9999999999).required(),
    gender: Joi.string().valid('Male', 'Female', 'Other').required(),
    
    joiningDate: Joi.date().iso().required(), 
    experience: Joi.number().integer().min(0).required(),
    
    dob: Joi.date().iso().required(), 
  
    insurance: Joi.object({
      policyAmount: Joi.number().positive().required(),
      type: Joi.string().valid('Health', 'Life', 'Vehicle', 'Dental').required(),
      startDate: Joi.date().iso().required(), 
      endDate: Joi.date().iso().required(), 
    })
      .custom((value, helpers) => {
        const { startDate, endDate } = value;
        
        if (new Date(endDate) <= new Date(startDate)) {
          return helpers.message('Insurance end date must be after start date.');
        }
        
        return value;
      })
      .optional(),

    position: Joi.string().valid('Employee').default('Employee'),
    designation: Joi.string()
      .valid(
        "Web Developer",
        "App Developer",
        "UX/UI Designer",
        "Database Administrator",
        "SEO Specialist"
      )
      .required(),
    accountNumber: Joi.string().required(),
    salary: Joi.number().positive().required(),
    
    address: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      country: Joi.string().required(),
    }).required(),
    
    image: Joi.string().uri().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: 'Validation failed', error: error.details });
  }
  next();
};
