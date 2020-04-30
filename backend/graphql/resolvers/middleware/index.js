import { skip } from 'graphql-resolvers';
import Task from '../../../database/models/task';
import {isValidObjectId} from '../../../database/util/index';

export function isAuthenticated(parent, args, { email }) {
  if (!email) {
    throw new Error('Access Denied! Pleade login to continue');
  }
  return skip;
}
export async function isTaskOwner(parent, { id }, { loggedInUserId }) {
  try {
    if(!isValidObjectId(id)) {
        throw new Error('Invalid Task id');
    }
    const task = await Task.findById(id);
    if (!task) {
      throw new Error('Task not found');
    } else if (task.user.toString() !== loggedInUserId) {
      throw new Error('Not authorized as task owner');
    }
    return skip;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export default {
  isAuthenticated,
  isTaskOwner,
};
