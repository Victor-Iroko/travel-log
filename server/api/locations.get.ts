import { findLocations } from '../database/queries/location'

export default defineAuthenticatedEventHandler(async (event) => {
  return await findLocations(Number(event.context.user.id))
})
