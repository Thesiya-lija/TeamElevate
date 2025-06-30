import express from 'express'
const router = express.Router();
import { authenticateRole } from '../middleware/authenticateUser.js';
import {applyForInsurance} from '../controller/empInsurance.js'
import {createShiftExchangeRequest,updateShiftExchangeStatus,getReceivedShiftExchangeRequests,getSentShiftExchangeRequests} from '../controller/shiftExchange.js'
import {createSuggestion} from '../controller/suggestion.js'
import { userSignin } from '../controller/Signin.js';
import { applyLeave,getEmployeeLeaves } from '../controller/leave.js';
import { getEmployee, getEmployeeById,updateEmployeeDetails,upload } from '../controller/employee.js';
import {fetchUserById} from '../controller/fetchuser.js'
import { resetPasswordEmp} from '../controller/resetPassword.js'
const empRoutes = express.Router();
empRoutes.put("/emp-update/:employeeId", authenticateRole("Employee"), upload, updateEmployeeDetails);
empRoutes.post('/emp-signin',userSignin)
empRoutes.get("/fetchUser/:id",authenticateRole('Employee'), fetchUserById);
empRoutes.put('/reset-password/:email',resetPasswordEmp)

empRoutes.post('/apply-insurance', authenticateRole('Employee'),applyForInsurance);

empRoutes.post('/shiftChange',authenticateRole('Employee'),createShiftExchangeRequest)

empRoutes.get('/emp-details/:employeeId',authenticateRole("Employee"),getEmployeeById)
empRoutes.get('/emps',authenticateRole("Employee"),getEmployee)

empRoutes.post('/suggestion',authenticateRole('Employee'),createSuggestion)
empRoutes.get('/leave/:employeeId',authenticateRole('Employee'),getEmployeeLeaves)
empRoutes.post('/apply-leave',authenticateRole('Employee'),applyLeave)

empRoutes.get('/received-req',authenticateRole("Employee"),getReceivedShiftExchangeRequests)
empRoutes.get('/sent-req',authenticateRole("Employee"),getSentShiftExchangeRequests)
empRoutes.patch("/accept-request/:requestId", authenticateRole("Employee"), updateShiftExchangeStatus);

export default empRoutes
