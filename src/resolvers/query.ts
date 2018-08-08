import User from "../models/user";

// Query methods implementation.
const QueryImpl = {
  user: async (parent, args) => {
    const user = await User.findById(args.id);
    return user;
  },
  users: async (parent, args) => {
    const users = await User.find(args);
    return users.map(user => {
      user._id = user._id.toString;
      return user;
    });
  }
}

export default QueryImpl;