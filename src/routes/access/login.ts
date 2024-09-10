import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse.js';
import crypto from 'crypto';
import UserRepo from '../../database/repository/UserRepo.js';
import { BadRequestError, AuthFailureError } from '../../core/ApiError.js';
import KeystoreRepo from '../../database/repository/KeystoreRepo.js';
import { createTokens } from '../../auth/authUtils.js';
import validator from '../../helpers/validator.js';
import schema from './schema.js';
import asyncHandler from '../../helpers/asyncHandler.js';
import bcrypt from 'bcrypt';
import { getUserData } from './utils.js';
import { PublicRequest } from '../../types/app-request.js';

const router = express.Router();

router.post(
  '/basic',
  validator(schema.credential),
  asyncHandler(async (req: PublicRequest, res) => {
    const user = await UserRepo.findByEmail(req.body.email);
    if (!user) throw new BadRequestError('User not registered');
    if (!user.password) throw new BadRequestError('Credential not set');

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) throw new AuthFailureError('Authentication failure');

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');

    await KeystoreRepo.create(user, accessTokenKey, refreshTokenKey);
    const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);
    const userData = await getUserData(user);

    new SuccessResponse('Login Success', {
      user: userData,
      tokens: tokens,
    }).send(res);
  }),
);

export default router;
