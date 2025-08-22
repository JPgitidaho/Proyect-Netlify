import mongoose from 'mongoose'
import { MONGO_URI } from './config/env.js'
export const connectDB = async () => { if (!MONGO_URI) throw new Error('MONGO_URI missing'); await mongoose.connect(MONGO_URI) }
