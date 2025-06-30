import Expense from '../models/expense.js'; 
export const createExpense = async (req, res) => {
  try {
    const { category, amount, paid_to, contact, date, description } = req.body;

    if (!category || !amount || !paid_to || !date) {
      return res.status(400).json({ message: 'Category, amount, paid_to, and date are required' });
    }
    const newExpense = new Expense({
      category,
      amount,
      paid_to,
      contact,
      date,
      description,
    });

    await newExpense.save();

    res.status(201).json({
      message: 'Expense created successfully',
      expense: newExpense,
    });
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getAllExpenses = async (req, res) => {
    try {
      const expenses = await Expense.find();
  
      res.status(200).json({
        message: 'Expenses retrieved successfully',
        expenses,
      });
    } catch (error) {
      console.error('Error retrieving expenses:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };
    