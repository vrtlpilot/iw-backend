import User from "../models/user";
import Pool from "../models/Pool";
import { getPoolData, getPoolDataMini } from './helpers';

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

  getPool: async (parent, { poolId }) => {
    const pool = await Pool.findById(poolId);
    return pool ? getPoolData(pool) : null;
  },

  searchPool: async (parent, { poolName }) => {
    const pools = await Pool.find({ poolName: new RegExp(`.*${poolName}.*`, 'i') });
    return pools.map((pool => getPoolDataMini(pool)));
  }
}

export default QueryImpl;