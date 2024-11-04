export async function POST(req) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) {
    throw new Error(
      'Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local'
    )
  }

  const svix_id = req.headers.get('svix-id')
  const svix_timestamp = req.headers.get('svix-timestamp')
  const svix_signature = req.headers.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400
    })
  }

  // Get the raw body instead of JSON to avoid altering the payload
  const body = await req.text()

  const wh = new Webhook(WEBHOOK_SECRET)
  let evt

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature
    })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Verification failed', {
      status: 400
    })
  }

  const { id } = evt?.data
  const eventType = evt?.type
  console.log(`Webhook with an ID of ${id} and type of ${eventType}`)
  console.log('Webhook body:', body)

  // Handle events
  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, first_name, last_name, image_url, email_addresses, username } =
      evt?.data
    try {
      const user = await createOrUpdateUser(
        id,
        first_name,
        last_name,
        image_url,
        email_addresses,
        username
      )
      if (user && eventType === 'user.created') {
        try {
          await clerkClient.users.updateUserMetadata(id, {
            publicMetadata: {
              userMongoId: user._id
            }
          })
        } catch (error) {
          console.log('Error updating user metadata:', error)
        }
      }
    } catch (error) {
      console.log('Error creating or updating user:', error)
      return new Response('Error occurred', {
        status: 400
      })
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt?.data
    try {
      await deleteUser(id)
    } catch (error) {
      console.log('Error deleting user:', error)
      return new Response('Error occurred', {
        status: 400
      })
    }
  }

  return new Response('', { status: 200 })
}
