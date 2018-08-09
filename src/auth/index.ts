import * as jsonwebtoken from 'jsonwebtoken';
import User from '../models/user';
import * as crypto from 'crypto';

const secret = 'secret';

function generateToken(userData, options) {
  const { secret } = options;
  return jsonwebtoken.sign(userData, secret);
}

function createHash(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

async function signUp(firstName: string, lastName: string, email: string, password: string): Promise<string> {
  const userData = {
    name: `${firstName} ${lastName}`,
    email,
    pwd: createHash(password)
  }
  const user = new User(userData);
  const { _id, name } = (await user.save()) as any;
  return generateToken({ userId: _id, name }, { secret });
}

async function login(email: string, password: string): Promise<string> {
  const user = await User.findOne({ email }) as any;
  if (!user) {
    throw new Error('No user with that email');
  }
  const isValidPassword = createHash(password) === user.pwd;
  if (!isValidPassword) {
    throw new Error('Incorrect password');
  }
  return generateToken({ userId: user._id, name: user.name }, { secret });
}

export {
  signUp,
  login
}