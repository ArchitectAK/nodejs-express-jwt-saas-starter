import { Router } from 'express';
var router = Router();
import { validate, signUp, login, getUser } from '../controllers/userController';
import userService from '../services/userService';
import { authJwt } from "../middlewares";

// A couple of test routes
// router.get('/test/users/:id', async (req, res, next) => {
//   const doc = await userService.getById(req.params.id);
//   return res.json(doc)
// });
// router.get('/test/users', async (req, res, next) => {
//   const docs = await userService.getAll();
//   return res.json({ users: docs })
// });

router.post('/signup', validate('signup'), signUp);
router.post('/login', validate('login'), login);

// Protected route
router.get('/user', authJwt.verifyToken, getUser);

export default router;
