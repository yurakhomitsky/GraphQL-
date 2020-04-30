import jwt from 'jsonwebtoken';
import User from './../../database/models/user';
export default  async function verifyUser(req) {
  try {
    req.email = null;
    req.loggedInUserId = null;
    const bearerHeader = req.headers.auth;
    if (bearerHeader) {
      const [, token] = bearerHeader.split(' ');
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY || 'secretkey'
      );
      req.email = payload.email;
      const user = await User.findOne({ email: payload.email });
      req.loggedInUserId = user.id;
    }
  } catch (error) {
      console.log(error);
      throw error;
  }
}
