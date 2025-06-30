import bcrypt from 'bcrypt';
import cloudinary from 'cloudinary';
import multer from 'multer';
import Employee from '../models/employee.js';
import dotenv from 'dotenv';

dotenv.config();


cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = multer.memoryStorage();
export const upload = multer({ storage }).single('image');


export const empSignUp = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'Error processing request', success: false });
      }

      const { firstname, lastname, middlename, phone, email, password, role, designation, joiningDate, salary } = req.body;

      if (!password) {
        return res.status(400).json({ message: 'Password is required', success: false });
      }

      const existingUser = await Employee.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists!', success: false });
      }

      const lastEmployee = await Employee.findOne().sort({ employeeId: -1 }).select('employeeId');
      let newEmployeeId = 'Emp100';
      if (lastEmployee && lastEmployee.employeeId) {
        const lastIdNumber = parseInt(lastEmployee.employeeId.replace('Emp', ''), 10);
        newEmployeeId = `Emp${lastIdNumber + 1}`;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newEmployee = new Employee({
        employeeId: newEmployeeId,
        firstname,
        middlename,
        lastname,
        phone,
        email,
        password: hashedPassword,
        role,
        designation,
        joiningDate: new Date(joiningDate),
        salary: Number(salary),
      });

      await newEmployee.save();
      res.status(201).json({ message: 'Registered Successfully', success: true, employeeId: newEmployeeId });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
};

export const updateEmployeeDetails = async (req, res) => {
    try {
      const { employeeId } = req.params;
  
      if (!employeeId) {
        return res.status(400).json({ message: "Employee ID is required", success: false });
      }

      const employee = await Employee.findOne({ employeeId });
  
      if (!employee) {
        return res.status(404).json({ message: "Employee not found", success: false });
      }
  
      const updatableFields = ["gender", "experience", "dob", "accountNumber", "address"];
      let updateData = {};
      let fieldsUpdated = false;

        for (const field of updatableFields) {
        if (req.body[field] !== undefined && req.body[field] !== employee[field]) {
          updateData[field] = req.body[field];
          fieldsUpdated = true;
        }
      }
  
      if (req.body.insurance) {
        let insuranceData = req.body.insurance;
  
        if (typeof insuranceData === "string") {
          try {
            insuranceData = JSON.parse(insuranceData);
          } catch (error) {
            return res.status(400).json({ message: "Invalid insurance data format", success: false });
          }
        }
  
        updateData.insurance = { ...employee.insurance.toObject(), ...insuranceData };
        fieldsUpdated = true;
      }
  
      if (req.file) {
        try {
          const result = await new Promise((resolve, reject) => {
            cloudinary.v2.uploader.upload_stream({ resource_type: "image" }, (error, result) => {
              if (error) {
                console.error("Cloudinary Error:", error);
                reject(error);
              } else {
                resolve(result);
              }
            }).end(req.file.buffer);
          });
  
          if (result.secure_url) {
            updateData.image = result.secure_url;
            fieldsUpdated = true;
          }
        } catch (cloudError) {
          return res.status(500).json({ message: "Image upload failed", success: false });
        }
      }
      if (!fieldsUpdated) {
        return res.status(400).json({ message: "No fields to update", success: false });
      }
  
  
      const updatedEmployee = await Employee.findOneAndUpdate(
        { employeeId },
        { $set: updateData },
        { new: true }
      );
  
      res.status(200).json({ 
        message: "Employee details updated successfully", 
        updatedFields: updateData, 
        employee: updatedEmployee 
      });
    } catch (error) {
      console.error("Error updating employee data:", error);
      res.status(500).json({ message: "Error updating employee data", success: false });
    }
  }

  
export const getEmployee = async (req, res) => {
    try {
        const employees = await Employee.find();
        if (!employees || employees.length === 0) {
            return res.status(404).json({ message: "No employees found", success: false });
        }
        res.status(200).json({ success: true, employees });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", success: false, error: error.message });
    }
};

export const getEmployeeById = async (req, res) => {
    try {
        const { employeeId } = req.params; 

        if (!employeeId) {
            return res.status(400).json({ success: false, message: "Employee ID is required" });
        }

        const employee = await Employee.findOne({ employeeId });

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }
        res.status(200).json({ success: true, employee });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

