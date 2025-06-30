  import bcrypt from 'bcrypt';
  import cloudinary from 'cloudinary';
  import multer from 'multer';
  import HR from '../models/hr.js';
  import dotenv from 'dotenv';

  dotenv.config();
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const storage = multer.memoryStorage();
  export const upload = multer({ storage }).single('image'); 

  export const hrSignUp = async (req, res) => {
    try {
      upload(req, res, async (err) => {  
        if (err) {
          return res.status(400).json({ message: 'Error processing request', success: false });
        }

        const { firstname, lastname, middlename, email, password, phone, position, joiningDate, salary } = req.body;

        if (!password) {
          return res.status(400).json({ message: 'Password is required', success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newHR = new HR({ firstname, lastname, middlename, email, password: hashedPassword, phone, position, joiningDate, salary });

        await newHR.save();
        res.status(201).json({ message: 'Registered Successfully', success: true });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error', success: false });
    }
  };


  export const updateHR = async (req, res) => {
    try {
      const { id } = req.params;
      const { address, experience, accountNo, gender, dob } = req.body;
        if (!id) {
        return res.status(400).json({ message: 'HR ID is required', success: false });
      }
  
      const existingHR = await HR.findById(id);
  
      if (!existingHR) {
        return res.status(404).json({ message: 'HR not found', success: false });
      }
  
      existingHR.address = address || existingHR.address;
      existingHR.experience = experience || existingHR.experience;
      existingHR.accountNo = accountNo || existingHR.accountNo;
      existingHR.gender = gender || existingHR.gender;
      existingHR.dob = dob || existingHR.dob;
  
      if (req.file) {
        try {
          const result = await new Promise((resolve, reject) => {
            cloudinary.v2.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
              if (error) {
                console.error(" Cloudinary Error:", error);
                reject(error);
              } else {
                resolve(result);
              }
            }).end(req.file.buffer);
          });
          existingHR.image = result.secure_url; 
        } catch (cloudError) {
          return res.status(500).json({ message: 'Image upload failed', success: false });
        }
      }
      await existingHR.save();
        res.status(200).json({ message: 'HR details updated successfully with remaining data', success: true, updatedHR: existingHR });
  
    } catch (error) {
      console.error(" Error inserting remaining data:", error);
      res.status(500).json({ message: 'Error inserting remaining data', success: false });
    }
  };


  export const hrDetails = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({ message: 'HR ID is required', success: false });
      }
  
      const hr = await HR.findById(id).select('-password'); 
      if (!hr) {
        return res.status(404).json({ message: 'HR not found', success: false });
      }
  
      res.status(200).json({ message: 'HR details fetched successfully', success: true, hr });
    } catch (error) {
      console.error('Error fetching HR details:', error);
      res.status(500).json({ message: 'Internal Server Error', success: false });
    }
  };