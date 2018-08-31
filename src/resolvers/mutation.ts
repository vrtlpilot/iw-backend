import User from "../models/user";
import Pool from "../models/Pool";
import Post, { getPostData } from "../models/Post";
import { formatPoolData, getPoolData } from '../models/Pool';

// Verify contract URL.
const verifyContractLink = process.env.ETH_VERIFY_CONTRACT_URL || 'https://etherscan.io/verifyContract';

// Mutation methods implementation.
const MutationImpl = {
  /* createUser: async (parent, args) => {
    const user = await new User(args);
    user.save();
    user._id = user._id.toString();
    return user;
  },
  removeUser: async (parent, args) => {
    const user = await User.findByIdAndRemove({where: args.id});
    return user;
  }, */
  
  /* upload: async (parent, { file }) => {
      const { stream, filename, mimetype, encoding } = await file;

      // 1. Validate file metadata.

      // 2. Record the file upload in your DB.
      // const id = await recordFile( … )

      return { filename, mimetype, encoding };
  }, */

  updateUser: async (_, { input }) => {
    const { id, ...userData } = input;
    const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });
    return updatedUser;
  },

  createPool: async (_, { input }) => {
    // deploy contract
    // save contract's information in db
    const poolData = formatPoolData(input);
    const pool = await Pool.create({ ...poolData, verifyContractLink });
    // temporarily return pool object
    return pool._id.toString();
  },

  createPost: async (_, { input: postData }) => {
    const post = await Post.create(postData);
    return post._id;
  },

  editPost: async (_, { input }) => {
    const { postId, ...postData } = input;
    const updatedPost = await Post.findByIdAndUpdate(postId, postData, { new: true });
    return getPostData(updatedPost);
 },

  deletePost: async (_, { postId }) => {
    const deletedPost = await Post.findByIdAndRemove(postId);
    return deletedPost._id;
  }
}

export default MutationImpl;