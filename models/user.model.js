import mongoose from '../lib/mongooseConnection';

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    email: String,
    password: String,
  })
);

export default User;