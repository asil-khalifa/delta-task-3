//ROUTES:

import { addUser, authenticateUser, getUserDetails, listUser } from "../controllers/user.js";
import express, { urlencoded } from 'express'

const userRouter = express.Router();

userRouter.use(express.urlencoded({extended: true}))

userRouter.post('/', addUser);

userRouter.get('/', listUser);

userRouter.post('/login', authenticateUser);

userRouter.get('/:id', getUserDetails);

export default userRouter;