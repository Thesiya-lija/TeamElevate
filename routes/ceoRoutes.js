import express from 'express';
import {ceoValidation} from '../middleware/ceoValidation.js'
import {signinValidation} from '../middleware/signinValidation.js'
import {ceoSignUp} from '../controller/ceo.js'
import {userSignin} from '../controller/Signin.js'
import {authenticateRole} from '../middleware/authenticateUser.js'
import {hrValidation} from '../middleware/hrValidation.js'
import {hrSignUp} from '../controller/hr.js'
import {getAllSuggestions} from '../controller/suggestion.js'
import { expenseValidation } from '../middleware/expenseValidation.js';
import { getAllExpenses } from '../controller/expense.js';
import {getEmployee} from '../controller/employee.js'
import {fetchUserById} from '../controller/fetchuser.js'
const ceoRoutes = express.Router();
ceoRoutes.post('/ceo-signup',ceoSignUp)
ceoRoutes.post('/ceo-signin',userSignin)
ceoRoutes.post('/hr-signup',authenticateRole("CEO"),hrSignUp)

ceoRoutes.get('/suggestion',authenticateRole("CEO"),getAllSuggestions)
ceoRoutes.get('/expense', authenticateRole("CEO"),getAllExpenses);
ceoRoutes.get("/fetchUser/:id", fetchUserById);


ceoRoutes.get('/employee',authenticateRole("CEO"),getEmployee );

export default ceoRoutes
