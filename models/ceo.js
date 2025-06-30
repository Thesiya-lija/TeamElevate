import mongoose from 'mongoose';

const ceoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  position: {
    type: String,
    default: 'CEO',
    required: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String, 
    required: true,
  },
});

const CEO = mongoose.model('CEO', ceoSchema, 'CEO');

export default CEO;
