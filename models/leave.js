import mongoose from "mongoose";
const leaveSchema = new mongoose.Schema({
    employeeId: {
        type: String, 
        ref: 'Employee',
        required: true
    },
    leaveType: {
        type: String,
        enum: ['Sick Leave', 'Casual Leave', 'Maternity Leave', 'Paternity Leave'],
        required: true
    },
    fromDate: {
        type: Date,
        required: true
    },
    toDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
        required: true
    }
});

const Leave = mongoose.model('Leave', leaveSchema, 'Leave');

export default Leave;
