import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';
dotenv.config();

let mongoServer: MongoMemoryServer;

jest.setTimeout(15000);

export const connectTestDB = async () => {
  process.env.JWT_SECRET = 'test_secret';
  process.env.JWT_EXPIRES_IN = '90d';
  const uri = 'mongodb+srv://rohitkumar24b_db_user:Rohit1166@cluster0.vzytdbc.mongodb.net/blog-api-test?appName=Cluster0';
  await mongoose.connect(uri);
};

export const closeTestDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

export const clearTestDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};
