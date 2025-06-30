import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Employee from "../models/employee.js";
import CEO from "../models/ceo.js";
import HR from "../models/hr.js";

export const userSignin = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await Employee.findOne({ email });
    let role = "Employee";
    let tokenPayload = {}; 

    if (!user) {
      user = await HR.findOne({ email });
      role = "HR";
    }

    if (!user) {
      user = await CEO.findOne({ email });
      role = "CEO";
    }

    if (!user) {
      return res.status(403).json({ message: "User not found. Please register first.", success: false });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(403).json({ message: "Incorrect password.", success: false });
    }

    if (role === "Employee") {
      console.log(user.employeeId);
      tokenPayload = {
        email: user.email,
        employeeId: user.employeeId, 
        role,
        _id:user._id
      };
    } else {
      tokenPayload = {
        email: user.email,
        _id: user._id, 
        role,
      };
    }

    const jwtToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login Successful",
      success: true,
      jwtToken,
      email: user.email,
      name: user.name,
      role,
      image: user.image || null,
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
