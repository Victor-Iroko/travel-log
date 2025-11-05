export type Place = {
  place_id: number
  licence: string
  osm_type: string
  osm_id: number
  lat: string // could also be number if you parse it
  lon: string // could also be number if you parse it
  class: string
  type: string
  place_rank: number
  importance: number
  addresstype: string
  name: string
  display_name: string
  boundingbox: [string, string, string, string] // could also be [number, number, number, number] if parsed
}

export type SearchPlaces = Place[]
