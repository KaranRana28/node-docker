import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse.js';
import asyncHandler from '../../helpers/asyncHandler.js';
import validator, { ValidationSource } from '../../helpers/validator.js';
import schema from './schema.js';
import { NotFoundError } from '../../core/ApiError.js';
import BlogRepo from '../../database/repository/BlogRepo.js';
import { Types } from 'mongoose';
import writer from './writer.js';
import editor from './editor.js';
import BlogCache from '../../cache/repository/BlogCache.js';

const router = express.Router();

router.use('/writer', writer);
router.use('/editor', editor);

router.get(
  '/url',
  validator(schema.blogUrl, ValidationSource.QUERY),
  asyncHandler(async (req, res) => {
    const blogUrl = req.query.endpoint as string;
    let blog = await BlogCache.fetchByUrl(blogUrl);

    if (!blog) {
      blog = await BlogRepo.findPublishedByUrl(blogUrl);
      if (blog) await BlogCache.save(blog);
    }

    if (!blog) throw new NotFoundError('Blog not found');
    return new SuccessResponse('success', blog).send(res);
  }),
);

router.get(
  '/id/:id',
  validator(schema.blogId, ValidationSource.PARAM),
  asyncHandler(async (req, res) => {
    const blogId = new Types.ObjectId(req.params.id);
    let blog = await BlogCache.fetchById(blogId);

    if (!blog) {
      blog = await BlogRepo.findInfoForPublishedById(
        new Types.ObjectId(req.params.id),
      );
      if (blog) await BlogCache.save(blog);
    }

    if (!blog) throw new NotFoundError('Blog not found');
    return new SuccessResponse('success', blog).send(res);
  }),
);

export default router;
