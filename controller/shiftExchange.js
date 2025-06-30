import Employee from '../models/employee.js';
import ShiftExchange from '../models/shiftExchange.js';
import Leave from '../models/leave.js';

export const createShiftExchangeRequest = async (req, res) => {
    try {
        const { shiftChanger, fromDate, toDate, reason } = req.body;
        const loggedInEmployeeId = req.user.employeeId; 

        const loggedInEmployee = await Employee.findOne({ employeeId: loggedInEmployeeId });

        if (!loggedInEmployee) {
            return res.status(404).json({ message: 'Logged-in employee not found' });
        }
        if (loggedInEmployee.employeeId === shiftChanger) {
            return res.status(400).json({ message: 'You cannot request a shift exchange with yourself.' });
        }
        const shiftChangerEmployee = await Employee.findOne({ employeeId: shiftChanger });

        if (!shiftChangerEmployee) {
            return res.status(404).json({ message: 'Shift changer not found' });
        }
        const loggedInDesignation = String(loggedInEmployee.designation || "").trim().toLowerCase();
        const shiftChangerDesignation = String(shiftChangerEmployee.designation || "").trim().toLowerCase();

        if (loggedInDesignation !== shiftChangerDesignation) {
            return res.status(400).json({ message: 'You can only swap shifts with an employee of the same designation.' });
        }
        const fromDateObj = new Date(fromDate);
        const toDateObj = new Date(toDate);
        const shiftDays = Math.ceil((toDateObj - fromDateObj) / (1000 * 60 * 60 * 24)) + 1;
        loggedInEmployee.leaveDays += shiftDays;
        await loggedInEmployee.save();
        shiftChangerEmployee.leaveDays -= shiftDays;
        await shiftChangerEmployee.save();

        const shiftExchangeRequest = new ShiftExchange({
            shiftRequester: loggedInEmployee.employeeId,
            shiftChanger: shiftChangerEmployee.employeeId,
            fromDate,
            toDate,
            reason,
            status: 'Pending',
        });

        await shiftExchangeRequest.save();

        return res.status(201).json({ message: 'Shift exchange request created successfully', shiftExchangeRequest });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const finalizeMonthlySalary = async () => {
    try {
        const employees = await Employee.find();

        for (let emp of employees) {
            const leaveRecords = await Leave.find({
                employeeId: emp.employeeId,
                status: "Approved",
                leaveType: { $ne: "Shift Exchange" },
                fromDate: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
                toDate: { $lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0) }
            });

            let totalLeaveDays = emp.leaveDays; 

            leaveRecords.forEach(leave => {
                const fromDate = new Date(leave.fromDate);
                const toDate = new Date(leave.toDate);
                totalLeaveDays += Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;
            });
            const baseSalary = emp.salary;
            const leaveDeductions = totalLeaveDays * (baseSalary / 30);
            const finalSalary = baseSalary - leaveDeductions;

            emp.finalSalary = finalSalary;
            emp.leaveDays = 0;
            await emp.save();
        }
    } catch (err) {
        console.error("Error in finalizing salaries:", err);
    }
};

export const getReceivedShiftExchangeRequests = async (req, res) => {
    try {
        const loggedInEmployeeId = req.user.employeeId;
        const receivedRequests = await ShiftExchange.find({ shiftChanger: loggedInEmployeeId });

        if (receivedRequests.length === 0) {
            return res.status(200).json({ message: "No shift exchange requests received.", receivedRequests: [] });
        }

        return res.status(200).json({ receivedRequests });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const getSentShiftExchangeRequests = async (req, res) => {
    try {
        const loggedInEmployeeId = req.user.employeeId;

        const sentRequests = await ShiftExchange.find({ shiftRequester: loggedInEmployeeId });

        if (sentRequests.length === 0) {
            return res.status(200).json({ message: "No shift exchange requests sent.", sentRequests: [] });
        }

        return res.status(200).json({ sentRequests });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const updateShiftExchangeStatus = async (req, res) => {
    try {
        console.log("Request Params:", req.params);
        let { requestId } = req.params;
        const { status } = req.body;

        if (!requestId) {
            return res.status(400).json({ message: "requestId parameter is required" });
        }

        requestId = requestId.trim();

        const request = await ShiftExchange.findOneAndUpdate(
            { _id: requestId, status: "Pending" }, 
            { status },
            { new: true }
        );

        if (!request) {
            return res.status(404).json({ message: "No pending request found with this ID" });
        }

        return res.status(200).json({ message: "Status updated successfully", request });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};
