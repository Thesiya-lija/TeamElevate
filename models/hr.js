import mongoose from 'mongoose';

const hrSchema = new mongoose.Schema({
    firstname: {
        type: String,
        trim: true,
    }, middlename: {
        type: String,
        trim: true,
    },
    lastname: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
    },
    phone: {
        type: Number,
        trim: true,
    },
    position: {
        type: String,
        default: 'HR',
    },
    salary: {
        type: Number,

    },
    address: {
        type: String,
        trim: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },
    dob: {
        type: Date,
    },
    image: {
        type: String,
    },
    joiningDate: {
        type: Date,
    },
    experience: {
        type: Number,
    },
    accountNo: {
        type: String,
        trim: true,
    },

});

const HR = mongoose.model('HR', hrSchema, "HR");

export default HR;
