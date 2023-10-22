import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { deleteValidation, loginValidation, registerValidation} from './validations/auth.js';
import UserModel from './models/User.js'
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js';
import cors from 'cors';

mongoose.connect('mongodb+srv://awakusu:pass12345@cluster0.wksswab.mongodb.net/task4db?retryWrites=true&w=majority')
.then(() => console.log('db ok'))
.catch((err) => console.log('db error', err));

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!!!');
});

app.post('/auth/login',loginValidation, await UserController.login)

app.post('/auth/register', registerValidation, await UserController.register)

app.get('/auth/me', checkAuth, await UserController.getMe)

app.get('/users', checkAuth, await UserController.getAll)

app.post('/users/delete',  checkAuth, deleteValidation, await UserController.deleteUsers)

app.post('/users/block',  checkAuth, deleteValidation, await UserController.blockUsers)

app.post('/users/unblock',  checkAuth, deleteValidation, await UserController.unblockUsers)

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('server ok');
});