import express from 'express';
import ApiKeyRepo from '../database/repository/ApiKeyRepo.js';
import { ForbiddenError } from '../core/ApiError.js';
import { PublicRequest } from 'app-request';
import schema from './schema.js';
import validator, { ValidationSource } from '../helpers/validator.js';
import asyncHandler from '../helpers/asyncHandler.js';
import { Header } from '../core/utils.js';

const router = express.Router();

export default router.use(
  validator(schema.apiKey, ValidationSource.HEADER),
  asyncHandler(async (req: PublicRequest, res, next) => {
    const key = req.headers[Header.API_KEY]?.toString();
    if (!key) throw new ForbiddenError();

    const apiKey = await ApiKeyRepo.findByKey(key);
    if (!apiKey) throw new ForbiddenError();

    req.apiKey = apiKey;
    return next();
  }),
);
