import mongoose from 'mongoose'

let initialized = false

export const connect = async () => {
  mongoose.set('strictQuery', true)

  if (initialized) {
    console.log('Already connected to MongoDB')
    return mongoose.connection
  }

  if (!process.env.MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    )
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'linksy',
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('Connected to MongoDB')
    initialized = true
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    throw error // Rethrow if you want to handle it in a calling function
  }
}
