import User from "../models/user";
import Pool from "../models/pool";
import { formatPoolData, getPoolData } from './helpers';

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

  updateUser: async (parent, { input }) => {
    const { id, ...userData } = input;
    const updatedUser = await User.findByIdAndUpdate(id, userData);
    return updatedUser;
  },

  createPool: async (parent, { input }) => {
    // deploy contract
    // save contract's information in db
    const poolData = formatPoolData(input);
    const verifyContractLink = 'https://etherscan.io/verifyContract';
    const pool = await Pool.create({ ...poolData, verifyContractLink });
    // temporarily return pool object
    return pool._id.toString();
  }  
}

export default MutationImpl;