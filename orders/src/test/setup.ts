import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
declare global {
  namespace NodeJS {
    interface Global {
      signin: () => string[];
    }
  }
}
let mongo: any;
jest.mock("../nats-wrapper");
beforeAll(async () => {
  jest.clearAllMocks();
  process.env.JWT_KEY = "hahajhas";
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  //build a JET payload
  const payload = {
    id: mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };
  //create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  //Build a Session Object
  const session = { jwt: token };
  //Turn that session into JSOn
  const sessionJSON = JSON.stringify(session);
  //Take JSON and encide it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");
  //retrun a string tahts the cookie with the encoded data
  return [`express:sess=${base64}`];
};
