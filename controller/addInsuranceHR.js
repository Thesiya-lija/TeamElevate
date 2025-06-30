import Insurance from "../models/insurance.js";
import empInsurance from "../models/empInsurance.js";
import Employee from "../models/employee.js";

export const addInsuranceHR = async (req, res) => {
  try {
    const { employeeId } = req.params; 
    const {
      insuranceType,
      policyNumber,
      coverageAmount,
      startDate,
      endDate,
      provider,
      premiumAmount,
    } = req.body;

    console.log("Received Request:", { employeeId, insuranceType });

    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }
    const employee = await Employee.findOne({ employeeId });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const employeeInsurance = await empInsurance.findOne({
      employeeId,
      insuranceType: { $regex: new RegExp(insuranceType, "i") },
    });

    if (!employeeInsurance) {
      return res.status(404).json({ message: "Insurance application not found for this employee" });
    }

    employeeInsurance.status = "Accepted";
    await employeeInsurance.save();

    const newInsurance = new Insurance({
      employeeId,
      insuranceType,
      policyNumber,
      coverageAmount,
      startDate,
      endDate,
      provider,
      premiumAmount,
      status: "Submitted", 
    });

    const savedInsurance = await newInsurance.save();
    console.log(" Insurance added successfully:", savedInsurance);

    res.status(201).json({
      message: "Insurance details added successfully and status updated to Accepted",
      insurance: savedInsurance,
    });
  } catch (error) {
    console.error(" Error adding insurance details:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
