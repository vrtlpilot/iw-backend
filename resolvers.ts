import User from "./models/user";

// Provide resolver functions for your schema fields
export default {
    Query: {
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
    },
    Mutation: {
      createUser: async (parent, args) => {
        const user = await new User(args);
        user.save();
        user._id = user._id.toString();
        return user;
      },
      removeUser: async (parent, args) => {
        const user = await User.findByIdAndRemove({where: args.id});
        return user;
      },
      updateUser: async (parent, args) => {
        const user = await User.findByIdAndUpdate(args.id, 
          {
            $set: args,
          }, { new: true }).catch(err => new Error(err));
        return user;
      }
    }
};