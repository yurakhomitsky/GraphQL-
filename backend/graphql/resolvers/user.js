import { USERS } from '../../data';
import User from '../../database/models/user';
import Task from '../../database/models/task';
import bcrypty from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { combineResolvers } from 'graphql-resolvers';
import isAuthenticated from './middleware/index';
import promiseHandler from '../../helper/promiseHandler/promiseHandler';
import {pubSub} from '../../subscription/index';
import {userEvents} from '../../subscription/events/index'
const USER = {
  Query: {
    users: () => USERS,
    user: combineResolvers(
      isAuthenticated,
      async (parent, { id }, { email }) => {
        try {
          const user = await User.findOne({ email });
          if (!user) {
            throw new Error('User not found!');
          }
          return user;
        } catch (error) {
          console.log(error);
          throw new Error(error);
        }
      }
    ),
  },
  Mutation: {
    signup: async (parent, { input }) => {
      try {
        const user = await User.findOne({ email: input.email });
        if (user) {
          throw new Error('Email already in use');
        }
        const hashedPassword = await bcrypty.hash(input.password, 12);
        const newUser = new User({ ...input, password: hashedPassword });
        const result = await newUser.save();
        pubSub.publish(userEvents.USER_CREATED, {
          userCreated: result
        })
        return result;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    login: promiseHandler(async(parent, {input}) => {
        const user = await User.findOne({ email: input.email });
        if (!user) {
          throw new Error('User not found');
        }
        const isPasswordValid = await bcrypty.compare(
          input.password,
          user.password
        );
        if (!isPasswordValid) {
          throw new Error('Incorrect Password');
        }
        const secret = process.env.JWT_SECRET_KEY || 'secretkey';
        const token = jwt.sign({ email: user.email }, secret, {
          expiresIn: '1d',
        });
        return { token };
    })
    // login: async (parent, { input }) => {
    //   try {
    //     const user = await User.findOne({ email: input.email });
    //     if (!user) {
    //       throw new Error('User not found');
    //     }
    //     const isPasswordValid = await bcrypty.compare(
    //       input.password,
    //       user.password
    //     );
    //     if (!isPasswordValid) {
    //       throw new Error('Incorrect Password');
    //     }
    //     const secret = process.env.JWT_SECRET_KEY || 'secretkey';
    //     const token = jwt.sign({ email: user.email }, secret, {
    //       expiresIn: '1d',
    //     });
    //     return { token };
    //   } catch (error) {
    //     console.log(error);
    //     throw error;
    //   }
    // },
  },
  Subscription: {
    userCreated: {
      subscribe: () => pubSub.asyncIterator(userEvents.USER_CREATED)
    }
  },
  User: {
    tasks: async ({ id }) => {
      try {
        const tasks = await Task.find({ user: id});
      }
      catch(error) {
        console.log(error);
        throw new Error(error);
      }
      
    },
  },
};

export default USER;
