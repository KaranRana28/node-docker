import { SuccessResponse } from '../core/ApiResponse.js';
import { RoleRequest } from 'app-request';
import crypto from 'crypto';
import UserRepo from '../database/repository/UserRepo.js';
import { BadRequestError } from '../core/ApiError.js';
import User from '../database/model/User.js';
import { createTokens } from '../auth/authUtils.js';
import asyncHandler from '../helpers/asyncHandler.js';
import bcrypt from 'bcrypt';
import { RoleCode } from '../database/model/Role.js';
import { getUserData } from '../routes/access/utils.js';

const signupUser = asyncHandler(async (req, res) => {
    const user = await UserRepo.findByEmail(req.body.email);
    if (user) throw new BadRequestError('User already registered');

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');
    const passwordHash = await bcrypt.hash(req.body.password, 10);

    const { newuser, keystore } = await UserRepo.create(
        {
            name: req.body.name,
            email: req.body.email,
            profilePicUrl: req.body.profilePicUrl,
            password: passwordHash,
        } as User,
        accessTokenKey,
        refreshTokenKey,
        RoleCode.LEARNER,
    );

    const tokens = await createTokens(
        newuser,
        keystore.primaryKey,
        keystore.secondaryKey,
    );
    const userData = await getUserData(newuser);

    return new SuccessResponse('Signup Successful', { user: userData, tokens: tokens }).send(res);
});

export default {
    signupUser
}