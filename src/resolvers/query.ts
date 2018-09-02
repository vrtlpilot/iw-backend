import User from "../models/user";
import Pool from "../models/Pool";
import { getPoolData, getPoolDataForSearchResult } from '../models/Pool';
import Post, { getPostData } from "../models/Post";
import Contract from "../models/Contract";

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
    const pool = await Pool
      .findById(poolId)
      .populate({
        path: 'owner',
        select: 'name'
      });
    return pool ? getPoolData(pool) : null;
  },

  searchPool: async (_, { poolName }) => {
    const pools = await Pool
      .find({ poolName: new RegExp(`.*${poolName}.*`, 'i') })
      .populate({
        path: 'owner',
        select: 'name'
      });
    return pools.map((pool => getPoolDataForSearchResult(pool)));
  },

  getPost: async (_, { postId }) => {
    const post = await Post.findById(postId);
    return post ? getPostData(post) : null;
  },

  getInvestors: async (_, { input }) => {
    // console.log('input')
    // console.log(input)
    const { sortBy, ...filterParams } = input;
    const searchingParamsObject = generateSearchingParamsObject(filterParams);
    // console.log('searchingParamsObject');
    // console.log(searchingParamsObject);
    const sortingParams = generateSortingParamsObj(sortBy);
    // console.log('sortingParams');
    // console.log(sortingParams);
    const investors = await User
      .find(searchingParamsObject)
      .sort(sortingParams)
      .select({ name: 1, follows: 1, login: 1 });

    const formattedInvestors = investors.map(investor => formatInvestor(investor));
    // console.log('formattedInvestors')
    // console.log(formattedInvestors)    
    return formattedInvestors;
  },
  getContracts: async (_, { input }) => {
    const { name, description, address } = input;
    const params = {} as any;
    if (name !== undefined) {
      params.name = new RegExp(`.*${name}.*`, 'i');
    }
    if (description !== undefined) {
      params.description = new RegExp(`.*${description}.*`, 'i');
    }
    const contracts = await Contract.find(params);
    return contracts;
  }
}

function generateSearchingParamsObject(filteredParams) {
  const result = {} as any;

  if (filteredParams.country !== undefined) {
    result.country = filteredParams.country;
  }

  if (filteredParams.followersRangeFilter !== undefined) {
    if (filteredParams.followersRangeFilter.from !== undefined) {
      const countOfFollowersFrom = `this.follows.length >= ${filteredParams.followersRangeFilter.from}`
      result.$where = countOfFollowersFrom;
    }

    if (filteredParams.followersRangeFilter.to !== undefined) {
      const countOfFollowersTo = `this.follows.length <= ${filteredParams.followersRangeFilter.to}`;
      if (result.$where) {
        result.$where = `${result.$where} && ${countOfFollowersTo}`;
      } else {
        result.$where = `${countOfFollowersTo}`;
      }
    }
  }

  return result;
}

function generateSortingParamsObj(sortBy) {
  switch (sortBy) {
    case 'NUMBER_OF_FOLLOWERS':
      return { follows: -1 };
    /*
    case 'CAPITAL_AMOUNT':
      return {};
    case 'PROFIT_LEVEL':
      return {};
    case 'PERCENTAGE_OF_PROFITABLE_INVESTMENTS':
      return {};
    */
    default:
      return {};
  }
}

// format investor item for UI
function formatInvestor(investor) {
  return {
    id: investor._id,
    name: investor.name,
    login: investor.login,
    countOfFollowers: investor.follows.length
  }
}

export default QueryImpl;
