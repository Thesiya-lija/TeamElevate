import HR from "../models/hr.js";
import CEO from "../models/ceo.js";
import Employee from "../models/employee.js";

export const fetchUserById = async (req, res) => {
  try {
    const { id } = req.params; 

    if (!id) {
      return res.status(400).json({ message: "User ID is required", success: false });
    }

    let user = await Employee.findById( id ).select("-password");
    if (user) return res.status(200).json({ success: true, role: "Employee", user });
    user = await CEO.findById(id).select("-password");
    if (user) return res.status(200).json({ success: true, role: "CEO", user });

    user = await HR.findById(id).select("-password");
    if (user) return res.status(200).json({ success: true, role: "HR", user });

    return res.status(404).json({ message: "User not found", success: false });

  } catch (error) {
    console.error(" Error fetching user:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
