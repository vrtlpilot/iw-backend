import User from "../models/user";
import Pool from "../models/Pool";
import { getPoolData, getPoolDataForSearchResult } from '../models/Pool';
import Post, { getPostData } from "../models/Post";

// Query methods implementation.
const QueryImpl = {
  /* user: async (parent, args) => {
    const user = await User.findById(args.id);
    return user;
  },
  users: async (parent, args) => {
    const users = await User.find(args);
    return users.map(user => {
      user._id = user._id.toString;
      return user;
    });
  }, */

  getPool: async (_, { poolId }) => {
    const pool = await Pool.findById(poolId);
    return pool ? getPoolData(pool) : null;
  },

  searchPool: async (_, { poolName }) => {
    const pools = await Pool.find({ poolName: new RegExp(`.*${poolName}.*`, 'i') });
    return pools.map((pool => getPoolDataForSearchResult(pool)));
  },

  getPost: async (_, { postId }) => {
    const post = await Post.findById(postId);
    return post ? getPostData(post) : null;
  },
}

export default QueryImpl;