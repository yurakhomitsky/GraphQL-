import { combineResolvers } from 'graphql-resolvers';
import Task from '../../database/models/task';
import User from '../../database/models/user';
import { isAuthenticated, isTaskOwner } from './middleware/index';
import {  base64ToString,stringToBase64} from '../../helper/base64/index';
const TASK = {
  Query: {
    tasks: combineResolvers(
      isAuthenticated,
      async (parent, { cursor = 0, limit = 10 }, { loggedInUserId }) => {
        try {
          const query = { user: loggedInUserId };
          if (cursor) {
            query['_id'] = {
              $gt: base64ToString(cursor),
              $lt: base64ToString(cursor),
            };
          }
          let tasks = await Task.find(query)
            .sort({ _id: -1 })
            .limit(limit + 1);
          const hasNextPage = tasks.length > limit;
          tasks = hasNextPage ? tasks.slice(0, -1) : tasks;

          return {
            taskFeed: tasks,
            pageInfo: {
              nextPageCursor: hasNextPage
                ? stringToBase64(tasks[tasks.length - 1].id)
                : null,
              hasNextPage,
            },
          };
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    ),
    task: combineResolvers(
      isAuthenticated,
      isTaskOwner,
      async (parent, { id }) => {
        try {
          const task = await Task.findById(id);
          return task;
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    ),
  },
  Mutation: {
    createTask: combineResolvers(
      isAuthenticated,
      async (parent, { input }, { email }) => {
        try {
          const user = await User.findOne({ email });
          const task = new Task({ ...input, user: user.id });
          const result = await task.save();
          user.tasks.push(result.id);
          await user.save();
          return result;
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    ),
    updateTask: combineResolvers(
      isAuthenticated,
      isTaskOwner,
      async (parent, { id, input }) => {
        try {
          const task = await Task.findByIdAndUpdate(
            id,
            { ...input },
            { new: true }
          );
          return task;
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    ),
    deleteTask: combineResolvers(
      isAuthenticated,
      isTaskOwner,
      async (parent, { id }, { loggedInUserId }) => {
        try {
          const task = await Task.findByIdAndDelete(id);
          await User.updateOne(
            { _id: loggedInUserId },
            { $pull: { tasks: task.id } }
          );
          return task;
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    ),
  },
  Task: {
    user: async (parent, args, { loaders }) => {
      try {
        const user = await loaders.user.load(parent.user.toString())
        // const user = await User.findById(parent.user);
        return user;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
};
export default TASK;
