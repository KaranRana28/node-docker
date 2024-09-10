import { getJson, setJson } from '../query.js';
import { Types } from 'mongoose';
import Blog from '../../database/model/Blog.js';
import { DynamicKey, getDynamicKey } from '../keys.js';
import { caching } from '../../config.js';
import { addMillisToCurrentDate } from '../../helpers/utils.js';

function getKeyForId(blogId: Types.ObjectId) {
  return getDynamicKey(DynamicKey.BLOG, blogId.toHexString());
}

function getKeyForUrl(blogUrl: string) {
  return getDynamicKey(DynamicKey.BLOG, blogUrl);
}

async function save(blog: Blog) {
  return setJson(
    getKeyForId(blog._id),
    { ...blog },
    addMillisToCurrentDate(caching.contentCacheDuration),
  );
}

async function fetchById(blogId: Types.ObjectId) {
  return getJson<Blog>(getKeyForId(blogId));
}

async function fetchByUrl(blogUrl: string) {
  return getJson<Blog>(getKeyForUrl(blogUrl));
}

export default {
  save,
  fetchById,
  fetchByUrl,
};
