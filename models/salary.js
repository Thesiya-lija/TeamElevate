import mongoose from "mongoose";

const salarySchema = new mongoose.Schema({
    employeeId: {
        type: String, 
        ref: 'Employee',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    salaryDate: {
        type: Date,
        required: true
    },
    salaryScript: {
        type: String, 
        required: false
    }
});

const Salary = mongoose.model('Salary', salarySchema, "Salary");

export default Salary;
