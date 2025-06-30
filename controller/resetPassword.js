
import bcrypt from "bcryptjs";
import HR from "../models/hr.js"; 
import Employee from "../models/employee.js";
import CEO from "../models/ceo.js";
export const resetPasswordHR = async (req, res) => {
    try {
        const { email } = req.params; 
        const { password } = req.body; 
        if ( !password ) {
            return res.status(400).json({ message: "Email and password fields are required" });
        }

        const hr = await HR.findOne({ email });
        if (!hr) {
            return res.status(404).json({ message: "User not found" });
        }

        const salt = await bcrypt.genSalt(10);
        hr.password = await bcrypt.hash(password, salt);
        await hr.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const resetPasswordCEO = async (req, res) => {
    try {
        const { email } = req.params; 
        const { password } = req.body; 
        if ( !password ) {
            return res.status(400).json({ message: "Email and password fields are required" });
        }


        const ceo = await CEO.findOne({ email });
        if (!ceo) {
            return res.status(404).json({ message: "User not found" });
        }

        const salt = await bcrypt.genSalt(10);
        ceo.password = await bcrypt.hash(password, salt);
        await ceo.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const resetPasswordEmp = async (req, res) => {
    try {
        const { email } = req.params; 
        const { password } = req.body;
        if ( !password ) {
            return res.status(400).json({ message: "Email and password fields are required" });
        }

        const emp = await Employee.findOne({ email });
        if (!Employee) {
            return res.status(404).json({ message: "User not found" });
        }
        const salt = await bcrypt.genSalt(10);
        emp.password = await bcrypt.hash(password, salt);
        await emp.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


