export type LatLongItem = {
  lat: number
  long: number
}

export type MapPoint = {
  id: number
  name: string
  description: string | null
} & LatLongItem

export type SetLocationEmit = Pick<MapPoint, 'name' | 'long' | 'lat'>
