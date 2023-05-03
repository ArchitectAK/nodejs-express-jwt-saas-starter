import { hashSync } from 'bcryptjs';
import UserModel from '../models/user.model';

export default {
    getAll,
    getById,
    getByEmail,
    // getByVerificationCode,
    // getDataByFacebookId,
    // getDataByGoogleId,
    getPasswordByEmail,
    create,
    update,
    // updateToken,
    // pushIntoTokensArray,
    delete: _delete
};

async function getAll() {
    const users = await UserModel.find().select('-password');
    return users;
    // return structureUserResponse(users, 'studio');
}

async function getById(id) {
    return await UserModel.findById(id).select('-password');
}

async function getByEmail(email) {
    return await UserModel.findOne({ email: email }).select('-password');
}
async function getPasswordByEmail(email) {
    return await UserModel.findOne({ email: email }).select('password');
}

async function create(userParams) {
    // validate email uniqueness
    if (await UserModel.findOne({ email: userParams.email })) {
        throw { code: 409, message: 'Email already exists' };
    }

    const user = new UserModel(userParams);

    // hash password
    if (userParams.password) {
        user.password = hashSync(userParams.password, 10);
    }

    await user.save();

    return user;
}

async function update(id, userParams) {
    const user = await UserModel.findById(id);

    // validate
    if (!user) throw { code: 404, message: 'User not found' };
    if (user.email !== userParams.email && await UserModel.findOne({ email: userParams.email })) {
        throw 'Email is already taken';
    }

    // hash password if it was entered
    if (userParams.password) {
        userParams.password = hashSync(userParams.password, 10);
    }

    // copy userParams properties to user
    Object.assign(user, userParams);

    await user.save();
    
    return user;
}

// async function updateToken(id, productName, token) {
//     return await UserModel.findOneAndUpdate(
//     { '_id': id, 'tokens.product': productName },
//     { "tokens.$.value" : token }).exec();
// }

async function _delete(id) {
    await UserModel.findByIdAndRemove(id);
}