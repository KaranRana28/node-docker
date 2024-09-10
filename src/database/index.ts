import mongoose from 'mongoose';
import Logger from '../core/Logger.js';
import { db } from '../config.js';

// Build the connection string
const dbURI = `mongodb://${db.user}:${encodeURIComponent(db.password)}@${db.host}:${db.port}/${db.name}`;
let counter = 0;

const options = {
  autoIndex: true,
  minPoolSize: db.minPoolSize, // Maintain up to x socket connections
  maxPoolSize: db.maxPoolSize, // Maintain up to x socket connections
  connectTimeoutMS: 60000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

Logger.debug(dbURI);

function setRunValidators() {
  this.setOptions({ runValidators: true });
}

mongoose.set('strictQuery', true);

// Create the database connection
mongoose
  .plugin((schema: any) => {
    schema.pre('findOneAndUpdate', setRunValidators);
    schema.pre('updateMany', setRunValidators);
    schema.pre('updateOne', setRunValidators);
    schema.pre('update', setRunValidators);
  })
  .connect(dbURI, options);

// CONNECTION EVENTS

// When connecting 
mongoose.connection.on('connecting', function () {
  console.log('Connecting to MongoDB...');
});

// When successfully connected
mongoose.connection.on('connected', () => {
  Logger.debug('MongoDB connected to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
  Logger.error('MongoDB connection error: ' + err);
  counter++;
  if (counter <= 3) {
    Logger.info('Retrying MongoDB connection in 5 seconds for 3 times, attampt no: ' + counter);
    setTimeout(() => {
      mongoose.plugin((schema: any) => { schema.pre('findOneAndUpdate', setRunValidators); schema.pre('updateMany', setRunValidators); schema.pre('updateOne', setRunValidators); schema.pre('update', setRunValidators); }).connect(dbURI, options);
    }, 5000);
  }
  mongoose.disconnect();
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  Logger.info('MongoDB connection disconnected');
});

// When reconnected 
mongoose.connection.on('reconnected', function () {
  console.log('MongoDB reconnected!');
});

// If the Node process ends, close the MongoDB connection
process.on('SIGINT', () => {
  mongoose.connection.close().finally(() => {
    Logger.info('MongoDB default connection disconnected through app termination');
    process.exit(0);
  });
});

export const connection = mongoose.connection;
