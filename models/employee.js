import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, unique: true },
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
  }, email: { type: String,  unique: true, trim: true },
  password: { type: String, },
  phone: { type: String, }, // Changed to String to preserve leading zeros
  gender: { type: String, enum: ["Male", "Female", "Other"], },
  joiningDate: { type: Date, },
  experience: { type: Number,  min: 0 },
  dob: { type: Date},
  insurance: {
    policyAmount: { type: Number },
    type: { type: String, default:"Life" },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  position: { type: String, default: "Employee", },
  designation: {
    type: String,
    enum: [
      "Web Developer",
      "App Developer",
      "UX/UI Designer",
      "Database Administrator",
      "SEO Specialist",
    ],

  },
  accountNumber: { type: String },
  salary: { type: Number},
  address: { type: String },
  image: { type: String },
});

employeeSchema.pre("save", async function (next) {
  if (!this.employeeId) {
    const lastEmployee = await mongoose
      .model("Employee")
      .findOne({}, {}, { sort: { employeeId: -1 } });

    const lastId = lastEmployee ? parseInt(lastEmployee.employeeId.replace("Emp", "")) : 99;
    this.employeeId = `Emp${lastId + 1}`;
  }
  next();
});

const Employee =
  mongoose.models.Employee ||
  mongoose.model("Employee", employeeSchema, "Employee");

export default Employee;
