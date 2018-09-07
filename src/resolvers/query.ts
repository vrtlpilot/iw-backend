import User from "../models/user";
import Pool from "../models/Pool";
import { getPoolData, getPoolDataForSearchResult } from '../models/Pool';
import Post, { getPostData } from "../models/Post";
import * as investorHelpers from './helpers/investor';
import * as postHelpers from './helpers/posts'
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
    const post = await Post
      .findById(postId)
      .populate({
        path: 'userId',
        select: 'name login'
      });
    return post ? getPostData(post) : null;
  },

<<<<<<< HEAD
  searchPost: async (_, { searchText }) => {
    const searchingParamsObject = postHelpers.generateSearchingParamsObject(searchText);
=======
  searchPost: async (_, { input }) => {
    const searchingParamsObject = postHelpers.generateSearchingParamsObject(input);
>>>>>>> 559173570c3dd714b561ad578bac52b5d02e46ce

    const posts = await Post
      .find(searchingParamsObject)
      .populate({
        path: 'userId',
        select: 'name login'
      });
    return posts.map((post => getPostData(post)));
  },

  getInvestors: async (_, { input }) => {
    const { sortBy, ...filterParams } = input;
    const searchingParamsObject = investorHelpers.generateSearchingParamsObject(filterParams);
    const sortingParams = investorHelpers.generateSortingParamsObj(sortBy);
    const investors = await User
      .find(searchingParamsObject)
      .sort(sortingParams)
      .select({ name: 1, follows: 1, login: 1 });

    const formattedInvestors = investors.map(investor => investorHelpers.formatInvestor(investor));
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

export default QueryImpl;
