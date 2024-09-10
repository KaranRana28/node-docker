import express from 'express';
import apikey from '../auth/apikey.js';
import permission from '../helpers/permission.js';
import { Permission } from '../database/model/ApiKey.js';
import signup from './access/signup.js';
import login from './access/login.js';
import logout from './access/logout.js';
import token from './access/token.js';
import credential from './access/credential.js';
import blog from './blog/index.js';
import blogs from './blogs/index.js';
import profile from './profile/index.js';

const router = express.Router();

/*---------------------------------------------------------*/
// router.use(apikey);
/*---------------------------------------------------------*/
/*---------------------------------------------------------*/
// router.use(permission(Permission.GENERAL));
/*---------------------------------------------------------*/
router.use('/signup', signup);
router.use('/login', login);
router.use('/logout', logout);
router.use('/token', token);
router.use('/credential', credential);
router.use('/profile', profile);
router.use('/blog', blog);
router.use('/blogs', blogs);

export default router;
