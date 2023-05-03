require('dotenv').config()
import { HOST, PORT, DB } from '../config/db.config.js';

import mongoose, { connect, connection } from 'mongoose';

// Set up default mongoose connection
const mongoDB = HOST + ':' + PORT + '/' + DB;
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: false, // Don't build indexes
  poolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};

connect(mongoDB, mongoOptions).
	catch(err => {
		console.error('Error connecting to MongoDB: ' + err)
		process.exit();
	});

connection.on('connected', function () {  
  console.log('Connection made to Mongo at: ' + mongoDB);
}); 

// If the connection throws an error after initially connecting
connection.on('error',function (err) {  
  console.log('Mongo connection error: ' + err);
  process.exit();
}); 

// When the connection is disconnected
connection.on('disconnected', function () {  
  console.log('Mongoo connection disconnected'); 
});

export default mongoose;