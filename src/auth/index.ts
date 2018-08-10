import * as jsonwebtoken from 'jsonwebtoken';
import User from '../models/user';
import * as crypto from 'crypto';
import { Hash } from 'crypto';

const secret = process.env.PWD_SEED || 'secret';

// Create JWT token.
function createToken(userData, options): string {
  const { secret } = options;
  return jsonwebtoken.sign(userData, secret);
}

// Digest a given data parameter.
function createDigest(data): string {
  const hash: Hash = crypto.createHash('sha256');
  hash.update(data);
  return hash.digest('hex');
}

// Signup request definition.
export async function signUp(firstName: string, lastName: string, email: string, password: string): Promise<string> {
  const userData = {
    name: `${firstName} ${lastName}`,
    email,
    pwd: createDigest(password)
  }
  const user = new User(userData);
  const { _id, name } = (await user.save()) as any;
  return createToken({ id: _id, name }, { secret });
}

// Login request definition.
export async function login(email: string, password: string): Promise<string> {
  const user = await User.findOne({ email }) as any;
  if (!user) {
    throw new IWError(401, `Cannot find user with email: ${email}`);
  }
  const isValidPassword = createDigest(password) === user.pwd;
  if (!isValidPassword) {
    throw new IWError(401, `Incorrect password for user: ${user.name}`);
  }
  return createToken({ id: user._id, name: user.name }, { secret });
}
