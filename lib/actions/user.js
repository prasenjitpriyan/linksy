import User from '../models/user.model'
import { connect } from './yourConnectionFile' // Adjust the import path to your connect function

export const createOrUpdateUser = async (
  id,
  first_name,
  last_name,
  image_url,
  email_addresses,
  username
) => {
  try {
    await connect() // Ensure the database connection is established
    const user = await User.findOneAndUpdate(
      { clerkId: id },
      {
        $set: {
          firstName: first_name,
          lastName: last_name,
          avatar: image_url,
          email: email_addresses[0]?.email_address || null, // Handle potential undefined access
          username
        }
      },
      { new: true, upsert: true }
    )
    return user
  } catch (error) {
    console.error('Error creating or updating user:', error)
    throw error // Rethrow the error for further handling if needed
  }
}

export const deleteUser = async (id) => {
  try {
    await connect() // Ensure the database connection is established
    const result = await User.findOneAndDelete({ clerkId: id })
    return result // Optionally return the deleted user
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error // Rethrow the error for further handling if needed
  }
}
