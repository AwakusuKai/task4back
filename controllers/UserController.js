import {validationResult} from 'express-validator';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';
import jwt from 'jsonwebtoken';

export const register = async(req, res) =>{
    if (!validationResult(req).isEmpty()){return res.status(400).send();}
    if (! await isEmailExists(req.body.email)){
        const user = await (await getUserModel(req)).save();
        res.json({user, token:  await getToken(user._id, user.fullName)})
    }else{
        res.status(400).json({message: 'A user with this email is already registered!',})
    }
}

export const deleteUsers = async(req, res)=>{
    if (!validationResult(req).isEmpty()){return res.status(400).send();}
    for(const Id in req.body.userIds){
        await UserModel.findOneAndDelete({_id: req.body.userIds[Id]})
    }
    const users = await UserModel.find();
    res.json(users);
}

export const blockUsers = async(req, res)=>{
    if (!validationResult(req).isEmpty()){return res.status(400).send();}
    for(const Id in req.body.userIds){
        await UserModel.findOneAndUpdate({_id: req.body.userIds[Id]}, {status: 'Blocked'}, {returnDocument:'after'});
    }
    const users = await UserModel.find();
    res.json(users);
}

export const unblockUsers = async(req, res)=>{
    if (!validationResult(req).isEmpty()){return res.status(400).send();}
    for(const Id in req.body.userIds){
        await UserModel.findOneAndUpdate({_id: req.body.userIds[Id]}, {status: 'Active'}, {returnDocument:'after'});
    }
    const users = await UserModel.find();
    res.json(users);
}

const getPasswordHash = async(password)=>{
    return await bcrypt.hash(password,  await bcrypt.genSalt())
}

const getUserModel = async (req) => {
    return new UserModel({
        email: req.body.email,
        fullName: req.body.fullName,
        passwordHash: await getPasswordHash(req.body.password),
    })
}

const getToken = async(id, fullName)=>{
    return await jwt.sign({_id: id, fullName: fullName}, 'secret', {expiresIn: '30d'})
    
}

export const login = async (req, res) =>{
    if (!validationResult(req).isEmpty()){return res.status(400).send();}
    const user = await UserModel.findOneAndUpdate({email: req.body.email}, {lastLoginDate: Date.now()}, {returnDocument:'after'});
    if(!user || !await bcrypt.compare(req.body.password, user._doc.passwordHash)){
        return res.status(404).json({message: 'Wrong login or password!'})
    }
    res.json({user, token: await getToken(user._id, user.fullName)})
}

export const getMe = async (req, res) =>{
    const user = await UserModel.findById(req._id);
    if(user.status == 'Blocked'){
        res.status(400).send;
    }
    res.json(user);
}

export const getAll = async (req, res) =>{
    const users = await UserModel.find();
    res.json(users);
}



const isEmailExists = async (email) => {
    return await UserModel.exists({email: email}) != null
}

