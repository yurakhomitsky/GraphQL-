import User from '../database/models/user';
export async function batchUsers(userIds) {
  const users = await User.find({ _id: { $in: userIds } });
  return userIds.map(userId => users.find(user => user.id === userId))
}
