import express from 'express';
import empInsurance from '../models/empInsurance.js';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import Employee from '../models/employee.js'; 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() }).single('proofImage');

const getEmployeeId = (req) => {
  return req.user?.employeeId || null;
};

export const applyForInsurance = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'File upload failed', error: err.message });
      }
      const employeeId = getEmployeeId(req);
      if (!employeeId) {
        return res.status(401).json({ message: 'Unauthorized: Employee ID missing' });
      }
      const employee = await Employee.findOne({ employeeId });
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      const insuranceType = employee.insurance?.type; 
      if (!insuranceType) {
        return res.status(400).json({ message: 'Insurance type not found for this employee' });
      }

      let proofImageUrl = null;

      if (req.file) {
        try {
          const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: 'insurance_proofs' },
              (error, cloudinaryResult) => {
                if (error) reject(error);
                else resolve(cloudinaryResult);
              }
            );
            stream.end(req.file.buffer);
          });

          proofImageUrl = result.secure_url; 
        } catch (uploadError) {
          return res.status(500).json({ message: 'Image upload failed', error: uploadError.message });
        }
      }
      const newInsurance = new empInsurance({
        employeeId,
        insuranceType,
        proofImage: proofImageUrl || null,
        status: 'Pending',
      });

      await newInsurance.save();

      res.status(201).json({
        message: 'Insurance application submitted successfully',
        insurance: newInsurance,
      });
    });
  } catch (error) {
    console.error('Error applying for insurance:', error);
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};
