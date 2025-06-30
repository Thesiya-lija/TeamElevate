import Leave from '../models/leave.js';
import Employee from '../models/employee.js';

export const applyLeave = async (req, res) => {
    try {
        const { leaveType, fromDate, toDate } = req.body;
        const employeeId = req.user.employeeId;
        const fromDateObj = new Date(fromDate);
        const toDateObj = new Date(toDate);
        const leaveDays = (toDateObj - fromDateObj) / (1000 * 60 * 60 * 24) + 1;
        const employee = await Employee.findOne({ employeeId });
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        if (employee.leaveDays < leaveDays) {
            return res.status(400).json({ message: "Insufficient leave balance." });
        }
        employee.leaveDays -= leaveDays;
        await employee.save();
        const leave = new Leave({
            employeeId,
            leaveType,
            fromDate,
            toDate,
            status: "Pending"
        });

        await leave.save();
        res.status(201).json({ message: "Leave request submitted with Pending status", leave });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getEmployeeLeaves = async (req, res) => {
    try {
        const { employeeId } = req.params;

        if (!employeeId) {
            return res.status(400).json({ error: "Employee ID is required" });
        }

        const leaves = await Leave.find({ employeeId });

        if (!leaves.length) {
            return res.status(404).json({ message: "No leave records found for this employee." });
        }

        res.status(200).json({ employeeId, leaves });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getAllEmployeeLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find();
        res.status(200).json(leaves);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateLeaveStatus = async (req, res) => {
    try {
        const { leaveId } = req.params;
        const { status } = req.body;
        const leave = await Leave.findById(leaveId);

        if (!leave) {
            return res.status(404).json({ message: "Leave request not found" });
        }

        leave.status = status;
        await leave.save();

        res.status(200).json({ message: "Leave status updated successfully", leave });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
