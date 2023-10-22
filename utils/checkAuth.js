import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';
import {validationResult} from 'express-validator';

export default async (req, res, next) => {
    try{
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    const decoded = jwt.verify(token, 'secret');
    req._id = decoded._id;
    checkUser();
    next();
    }catch(err){
        console.log(err);
        return  res.status(403).send('No acces')
    }
    
}

const checkUser = (id) => {
    return  UserModel.findById(id);
}



