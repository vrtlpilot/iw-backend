import mongoose = require('mongoose');
require('dotenv').config();

const DB_URI = `mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@ds161751.mlab.com:61751/iwdb`;

// Setup DB.
const dbOptions = {
	useNewUrlParser: true,
	autoIndex: false, // Don't build indexes
	reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
	reconnectInterval: 500, // Reconnect every 500ms
	poolSize: 2, // Maintain up to 10 socket connections
	// If not connected, return errors immediately rather than waiting for reconnect
	bufferMaxEntries: 0,
	connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
	socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
	family: 4 // Use IPv4, skip trying IPv6
};

mongoose.set('debug', true);

export default () => {
	const db = mongoose.connection
		db.on('error', (error) => {throw new Error(`Failed to connect to DB: ${error}`)})
			.on('close', () => console.log('DB connection closed.'))
			.once('open', () => console.log('Established connection to DB.'));
	return mongoose.connect(DB_URI, dbOptions);
};