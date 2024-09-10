import { getListRange, setList } from '../query.js';
import Blog from '../../database/model/Blog.js';
import { DynamicKey, getDynamicKey } from '../keys.js';
import { addMillisToCurrentDate } from '../../helpers/utils.js';
import { caching } from '../../config.js';
import { Types } from 'mongoose';

function getKeyForSimilar(blogId: Types.ObjectId) {
  return getDynamicKey(DynamicKey.BLOGS_SIMILAR, blogId.toHexString());
}

async function saveSimilarBlogs(blogId: Types.ObjectId, blogs: Blog[]) {
  return setList(
    getKeyForSimilar(blogId),
    blogs,
    addMillisToCurrentDate(caching.contentCacheDuration),
  );
}

async function fetchSimilarBlogs(blogId: Types.ObjectId) {
  return getListRange<Blog>(getKeyForSimilar(blogId));
}

export default {
  saveSimilarBlogs,
  fetchSimilarBlogs,
};
