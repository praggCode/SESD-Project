import connectDB from './config/db';
import { env } from './config/env';

const start = async () => {
  await connectDB();
  console.log(`Server ready on port ${env.PORT}`);
};

start();