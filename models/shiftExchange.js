import mongoose from 'mongoose';
const shiftExchangeSchema = new mongoose.Schema({
    shiftRequester: {
        type: String,  
        ref: 'Employee',  
        required: true,
    },
    shiftChanger: {
        type: String,  
        ref: 'Employee', 
        required: true,
    },
    fromDate: {
        type: Date,
        required: true,
    },
    toDate: {
        type: Date,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted'],
        default: 'Pending',
        required: true,
    },
});

shiftExchangeSchema.index({ shiftRequester: 1, shiftChanger: 1 });
const ShiftExchange = mongoose.model('ShiftExchange', shiftExchangeSchema, 'ShiftExchange');

export default ShiftExchange;
