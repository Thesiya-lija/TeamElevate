import mongoose from "mongoose";


const insuranceSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        ref: 'Employee', 
        required: true
    },
    insuranceType: {
        type: String,
        enum: ['Health', 'Life'],
        required: true
    },
    policyNumber: {
        type: Number,
        required: true,
        unique: true
    },
    coverageAmount: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    provider: {
        type: String,
        required: true
    },
    premiumAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Submitted', 'Pending', 'Cancelled'],
        default: 'Pending',
        required: true
    }
});

const Insurance = mongoose.model('Insurance', insuranceSchema,'Insurance');
export default Insurance
