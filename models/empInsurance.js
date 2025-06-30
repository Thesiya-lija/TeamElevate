import mongoose from "mongoose"
const empinsuranceSchema = new mongoose.Schema({
    employeeId: {
        type: String, 
        ref: 'Employee',
        required: true
    },
    insuranceType: {
        type: String,
       default:"Life",
        required: true
    },
    proofImage: {
        type: String, 
        required: false
    },
    status: {
        type: String,
        enum: ['Accepted', 'Pending', 'Cancelled', 'Submitted'],
        default: 'Pending',
        required: true
    }
})
const empInsurance=mongoose.model('EmpInsurance',empinsuranceSchema,'EmpInsurance')
export default empInsurance 

