import express from 'express';
import { getEmployeeInsurance } from '../controller/fetchInsurance.js';
import { createExpense,getAllExpenses } from '../controller/expense.js';
import {empValidation} from '../middleware/empValidation.js'
import {empSignUp} from '../controller/employee.js'
import {signinValidation} from '../middleware/signinValidation.js'
import {addInsuranceHR} from '../controller/addInsuranceHR.js'
import { expenseValidation } from '../middleware/expenseValidation.js';
import {getAllSuggestions} from '../controller/suggestion.js'
import { authenticateRole } from '../middleware/authenticateUser.js';
import {userSignin} from '../controller/Signin.js'
import {getEmployee} from '../controller/employee.js'
import { getAllEmployeeLeaves,updateLeaveStatus } from '../controller/leave.js';
import {fetchUserById} from '../controller/fetchuser.js'
import { updateHR,upload,hrDetails } from '../controller/hr.js';
import {resetPasswordHR} from '../controller/resetPassword.js'

const hrRoutes = express.Router();

hrRoutes.put('/hr-update/:id',upload, updateHR);
hrRoutes.post('/emp-signup',authenticateRole("HR"),empSignUp)
hrRoutes.get("/fetchUser/:id",fetchUserById);
hrRoutes.post('/hr-signin',userSignin)
hrRoutes.get('/insurance',authenticateRole('HR'), getEmployeeInsurance);
hrRoutes.post('/addInsuranceHR/:employeeId',authenticateRole('HR'), addInsuranceHR);
hrRoutes.get('/employee',authenticateRole('HR'),getEmployee );
hrRoutes.get('/hr-details/:id',hrDetails)
hrRoutes.put('/reset-password/:email',authenticateRole('HR'),resetPasswordHR)

hrRoutes.post('/expense', authenticateRole('HR'),createExpense);
hrRoutes.get('/expense', authenticateRole('HR'),getAllExpenses);
hrRoutes.get('/suggestion',authenticateRole('HR'),getAllSuggestions)

hrRoutes.get('/leave',authenticateRole('HR'),getAllEmployeeLeaves)
hrRoutes.put('/leave-status/:leaveId',authenticateRole('HR'),updateLeaveStatus)
export default hrRoutes