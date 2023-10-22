import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: true},
    lastLoginDate: {type: Date, required: true, default: Date.now()},
    status: {type: String, required: true, default: 'Active'},  
},
{
    timestamps: true,
},);

UserSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

UserSchema.set('toJSON', {
    virtuals: true
});

export default mongoose.model('User', UserSchema);