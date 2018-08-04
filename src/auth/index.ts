import * as jsonwebtoken from 'jsonwebtoken';

const secret = 'secret';

function generateToken(userData, options) {
  const { id, email } = userData;
  const { secret } = options;
  return jsonwebtoken.sign({ id, email }, secret);
}

async function signUp(username, email, password) {
  // creating user
  return generateToken({ username, email }, { secret });
}

async function login(email, password) {
  // find user
  const user = { username: "Name", email: "example@mail.com" };
  return generateToken({ username: user.username, email: user.email }, { secret });
}

export {
  signUp,
  login
}