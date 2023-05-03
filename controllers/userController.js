import { getByEmail, create, getPasswordByEmail, getById } from '../services/userService';
import { users } from '../_helpers/structures';
import { sign } from 'jsonwebtoken';
import { compareSync } from 'bcryptjs';
import { JWT_SIGNING_KEY, JWT_EXPIRY } from '../config/app.config.js';

import { body, validationResult } from 'express-validator';
const customValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return {
      message: error.msg,
    };
  }
});

export async function getUser(req, res, next) {
    let user = await getByEmail(req.email);
    if (user) {
        return res.json(users(user, req.accessToken));
    } else {
        const err = { code: 404, message: 'Oops! User not found.' };
        next(err);
    }
}

export async function signUp(req, res, next) {
    const errors = customValidationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json(errors.array()[0]);
        return;
    }

    const token = sign({ email: req.body.email }, JWT_SIGNING_KEY, { expiresIn: JWT_EXPIRY });

    let newUser = { email: req.body.email, password: req.body.password }
    try {
        newUser = await create(newUser);
        return res.json(users(newUser, token));
    } catch(err) {
        next(err);
    }
}

export async function login(req, res, next) {
    const errors = customValidationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json(errors.array()[0]);
        return;
    }
  
    try {
        let user = await getPasswordByEmail(req.body.email);
        if (user) {
            if (compareSync(req.body.password, user.password)) {
                let user = await getByEmail(req.body.email);
                // Generate new token and store with user
                const token = sign({ email: req.body.email }, JWT_SIGNING_KEY, { expiresIn: JWT_EXPIRY });
                return res.json(users(await getById(user.id), token));
            } else {
                const err = { code: 401, message: 'Oops, these credentials do not match!' };
                next(err);
            }
        } else {
            const err = { code: 404, message: 'This email is not registered!' };
            next(err);
        }
    } catch(err) {
        next(err)
    }
}


export function validate(method) {
  switch (method) {
    case 'signup':
      return [ 
        body('email', 'Invalid email provided!').exists().isEmail(),
        body('password', 'Password does not exist').exists()
      ]
      break;
    case 'login':
      return [
        body('email', 'Invalid email provided!').exists().isEmail(),
        body('password', 'Password does not exist').exists()
      ]
      break;
  }
}