import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import cloudinary from 'cloudinary';
import multer from 'multer';
import CEO from '../models/ceo.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors()); 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('image'); 
export const ceoSignUp = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'Error uploading image', success: false });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'Image file is required', success: false });
      }

      const { name, email, password, phone, gender, dob, experience, position, address } = req.body;

      if (!name || !email || !password || !phone || !gender || !dob || !experience || !address) {
        return res.status(400).json({ message: 'All fields are required', success: false });
      }
      const allowedGenders = ['Male', 'Female', 'Other'];
      if (!allowedGenders.includes(gender)) {
        return res.status(400).json({ message: 'Invalid gender value', success: false });
      }
      const existingUser = await CEO.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'A user with this email already exists', success: false });
      }
      const imageBuffer = req.file.buffer;

      cloudinary.v2.uploader.upload_stream(
        { resource_type: 'image' },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ message: 'Image upload failed', success: false });
          }
          const image = result.secure_url;
          const hashedPassword = await bcrypt.hash(password, 10);
          const newCEO = new CEO({
            name,
            email,
            password: hashedPassword,
            phone,
            gender,
            dob,
            experience,
            position,
            address,
            image,
          });

          await newCEO.save();

          res.status(201).json({ message: 'Registered Successfully', success: true });
        }
      ).end(imageBuffer); 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
};




