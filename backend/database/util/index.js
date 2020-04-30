import mongoose from 'mongoose';

export function connecToDb() {
  try {
 mongoose.connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(() => console.log('DataBase Connected Successfully'))
    
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}