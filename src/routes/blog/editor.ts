import express from 'express';
import { SuccessResponse, SuccessMsgResponse } from '../../core/ApiResponse.js';
import { ProtectedRequest } from 'app-request.js';
import { BadRequestError, ForbiddenError } from '../../core/ApiError.js';
import BlogRepo from '../../database/repository/BlogRepo.js';
import { RoleCode } from '../../database/model/Role.js';
import { Types } from 'mongoose';
import validator, { ValidationSource } from '../../helpers/validator.js';
import schema from './schema.js';
import asyncHandler from '../../helpers/asyncHandler.js';
import authentication from '../../auth/authentication.js';
import authorization from '../../auth/authorization.js';
import role from '../../helpers/role.js';

const router = express.Router();

/*-------------------------------------------------------------------------*/
router.use(
  authentication,
  role(RoleCode.ADMIN, RoleCode.EDITOR),
  authorization,
);
/*-------------------------------------------------------------------------*/

router.put(
  '/publish/:id',
  validator(schema.blogId, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const blog = await BlogRepo.findBlogAllDataById(
      new Types.ObjectId(req.params.id),
    );
    if (!blog) throw new BadRequestError('Blog does not exists');

    blog.isDraft = false;
    blog.isSubmitted = false;
    blog.isPublished = true;
    blog.text = blog.draftText;
    if (!blog.publishedAt) blog.publishedAt = new Date();

    await BlogRepo.update(blog);
    return new SuccessMsgResponse('Blog published successfully').send(res);
  }),
);

router.put(
  '/unpublish/:id',
  validator(schema.blogId, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const blog = await BlogRepo.findBlogAllDataById(
      new Types.ObjectId(req.params.id),
    );
    if (!blog) throw new BadRequestError('Blog does not exists');

    blog.isDraft = true;
    blog.isSubmitted = false;
    blog.isPublished = false;

    await BlogRepo.update(blog);
    return new SuccessMsgResponse('Blog unpublished successfully').send(res);
  }),
);

router.delete(
  '/id/:id',
  validator(schema.blogId, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const blog = await BlogRepo.findBlogAllDataById(
      new Types.ObjectId(req.params.id),
    );
    if (!blog) throw new BadRequestError('Blog does not exists');

    blog.status = false;

    await BlogRepo.update(blog);
    return new SuccessMsgResponse('Blog deleted successfully').send(res);
  }),
);

router.get(
  '/published/all',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const blogs = await BlogRepo.findAllPublished();
    return new SuccessResponse('success', blogs).send(res);
  }),
);

router.get(
  '/submitted/all',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const blogs = await BlogRepo.findAllSubmissions();
    return new SuccessResponse('success', blogs).send(res);
  }),
);

router.get(
  '/drafts/all',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const blogs = await BlogRepo.findAllDrafts();
    return new SuccessResponse('success', blogs).send(res);
  }),
);

router.get(
  '/id/:id',
  validator(schema.blogId, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const blog = await BlogRepo.findBlogAllDataById(
      new Types.ObjectId(req.params.id),
    );

    if (!blog) throw new BadRequestError('Blog does not exists');
    if (!blog.isSubmitted && !blog.isPublished)
      throw new ForbiddenError('This blog is private');

    new SuccessResponse('success', blog).send(res);
  }),
);

export default router;
