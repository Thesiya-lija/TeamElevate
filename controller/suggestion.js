  import Suggestion from '../models/suggestion.js';

  export const createSuggestion = async (req, res) => {
    try {
      const { title, description } = req.body;

      if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required' });
      }

      if (!req.user) {
        return res.status(403).json({ message: 'Unauthorized. User data not found.' });
      }

      const newSuggestion = new Suggestion({
        title,
        description,
        employeeId: req.user.employeeId,
        
      });

      await newSuggestion.save();
      res.status(201).json({ message: 'Suggestion added successfully', suggestion: newSuggestion });
    } catch (error) {
      console.error('Error creating suggestion:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  export const getAllSuggestions = async (req, res) => {
    try {
      const suggestions = await Suggestion.find()
       
      console.log(suggestions);
      res.status(200).json({ suggestions });
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      res.status(500).json({ message: 'Error fetching suggestions' });
    }
  };


