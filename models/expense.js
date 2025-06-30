import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: [
      'Office Supplies',
      'Travel',
      'Utilities',
      'Salaries',
    ], 
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0, 
    required: true,
  },
  paid_to: {
    type: String,
    required: true, 
  },
  contact: {
    type: Number, 
    required:true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  description: {
    type: String,
    maxlength: 500, 
  }
});

const Expense = mongoose.model('Expense', expenseSchema, "Expense");

export default Expense;
