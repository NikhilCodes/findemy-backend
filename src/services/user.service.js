import { User } from "../entities";

export async function findUserById(id) {
  return User.findById(id);
}

export async function findUserByEmail(email) {
  return User.findOne({ email });
}

export async function saveUser({ email, password, name }) {
  const user = new User({ email, password, name });
  return user.save();
}