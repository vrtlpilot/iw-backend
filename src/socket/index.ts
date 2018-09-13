import IO = require('koa-socket-2');
import Message from '../models/Message';
import Chat from '../models/Chat';
import User from '../models/user';
import * as cookie from 'cookie';

const onlineUsers = new Map();

function decodeCookie(cookie) {
  const decodedCookie = Buffer.from(cookie, 'base64').toString('utf8');
  return JSON.parse(decodedCookie);
}

function getSession(cookies, cookieKey) {
  const parsedCookies = cookie.parse(cookies || '');
  const sessionCookie = parsedCookies[cookieKey];
  if (sessionCookie) {
    const decodedCookie = decodeCookie(sessionCookie);
    if (decodedCookie.passport && decodedCookie.passport.user && Object.keys(decodedCookie.passport.user).length !== 0) {
      return decodedCookie.passport.user;
    }
  }
  return false;
}

const io = new IO();

io.use(async (ctx, next) => {
  const cookieKey = 'sess:key';
  const userId = getSession(ctx.socket.socket.request.headers.cookie, cookieKey);
  if (userId) {
    ctx.state = {
      isAuth: true,
      userId
    };
  } else {
    ctx.state = {
      isAuth: false
    };
  }
  await next();
})

io.on('connection', async (ctx) => {
  const socketId = ctx.socket.id;
  const cookieKey = 'sess:key';
  const userId = getSession(ctx.socket.request.headers.cookie, cookieKey);
  if (userId) {
    onlineUsers.set(userId, socketId);
  }
});

io.on('disconnect', async (ctx) => {
  if (ctx.state.isAuth) {
    onlineUsers.delete(ctx.state.userId);
  }
});

io.on('newMessage', async (ctx, data) => {
  if (!ctx.state.isAuth) {
    return;
  }

  try {
    const authorId = ctx.state.userId;
    const { text, partnerId } = data;

    const messageData = {
      user_id: authorId,
      content: text
    };
    const message = await Message.create(messageData) as any;

    let chat = await Chat.findOne({ members: { $all: [authorId, partnerId] } }) as any;

    if (!chat) {
      chat = await Chat.create({ members: [authorId, partnerId] });
      await User.findByIdAndUpdate(authorId, { $push: { chats: chat._id } });
      await User.findByIdAndUpdate(partnerId, { $push: { chats: chat._id } });
    }

    chat.messages.push(message._id);
    await chat.save();

    const response = {
      chatId: chat._id,
      messageId: message._id,
      read: message.read,
      user_id: message.user_id,
      content: message.content,
      date: message.date
    }
    
    if (onlineUsers.has(partnerId)) {
      const partnerSocket = onlineUsers.get(partnerId);
      io.to(partnerSocket).emit('newMessage', response);
    }

    ctx.socket.emit('newMessage', response);
  } catch (error) {
    console.log(error);
  }
});

export default io;
