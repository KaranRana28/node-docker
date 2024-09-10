import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse.js';
import { RoleRequest } from 'app-request';
import crypto from 'crypto';
import UserRepo from '../../database/repository/UserRepo.js';
import { BadRequestError } from '../../core/ApiError.js';
import User from '../../database/model/User.js';
import { createTokens } from '../../auth/authUtils.js';
import validator from '../../helpers/validator.js';
import schema from './schema.js';
import asyncHandler from '../../helpers/asyncHandler.js';
import bcrypt from 'bcrypt';
import { RoleCode } from '../../database/model/Role.js';
import { getUserData } from './utils.js';
import userController from '../../controllers/auth-access-controller.js';

const router = express.Router();

router.post('/basic', validator(schema.signup), userController.signupUser);
// asyncHandler(async (req: RoleRequest, res) => {
//   const user = await UserRepo.findByEmail(req.body.email);
//   if (user) throw new BadRequestError('User already registered');

//   const accessTokenKey = crypto.randomBytes(64).toString('hex');
//   const refreshTokenKey = crypto.randomBytes(64).toString('hex');
//   const passwordHash = await bcrypt.hash(req.body.password, 10);

//   const { user: createdUser, keystore } = await UserRepo.create(
//     {
//       name: req.body.name,
//       email: req.body.email,
//       profilePicUrl: req.body.profilePicUrl,
//       password: passwordHash,
//     } as User,
//     accessTokenKey,
//     refreshTokenKey,
//     RoleCode.LEARNER,
//   );

//   const tokens = await createTokens(
//     createdUser,
//     keystore.primaryKey,
//     keystore.secondaryKey,
//   );
//   const userData = await getUserData(createdUser);

//   new SuccessResponse('Signup Successful', {
//     user: userData,
//     tokens: tokens,
//   }).send(res);
// }),
// );

export default router;
