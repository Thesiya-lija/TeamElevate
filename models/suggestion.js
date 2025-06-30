import mongoose from 'mongoose';

const SuggestionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    employeeId: {
      type: String,
      ref: 'Employee', 
      required: true,
    },
 
    
  },
  
);

export default mongoose.model('Suggestion', SuggestionSchema,'Suggestion');
