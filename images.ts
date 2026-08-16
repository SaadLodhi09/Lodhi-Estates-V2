/**
 * Placeholder photography sourced from Unsplash (free license, no attribution
 * required). Swap the `id` values for real listing photography when available —
 * every other component reads from this single map, so no other file needs to
 * change.
 */
const ids = {
  exteriorDusk: '1748063578185-3d68121b11ff',
  exteriorHillside: '1580587771525-78b9dba3b914',
  exteriorCourtyard: '1613490493576-7fde63acd811',
  exteriorPool: '1512917774080-9991f1c4c750',
  exteriorSky: '1600596542815-ffad4c1539a9',
  exteriorBalconies: '1721815693498-cc28507c0ba2',
  exteriorClean: '1628012209120-d9db7abf7eab',
  exteriorTerrace: '1582268611958-ebfd161ef9cf',
  exteriorGarden: '1602343168117-bb8ffe3e2e9f',
  exteriorLounge: '1706808849780-7a04fbac83ef',
  exteriorWater: '1670589953882-b94c9cb380f5',
  exteriorDrive: '1688653802629-5360086bf632',
  interiorWindow: '1583847268964-b28dc8f51f92',
  interiorLounge: '1724582586529-62622e50c0b3',
  interiorFireplace: '1600210491892-03d54c0aaf87',
  interiorLiving: '1729086046027-09979ade13fd',
  interiorSeating: '1705321963943-de94bb3f0dd3',
  interiorMinimal: '1598928506311-c55ded91a20c',
} as const;

export type ImageKey = keyof typeof ids;

export function img(key: ImageKey, width = 1600): string {
  return `https://images.unsplash.com/photo-${ids[key]}?q=80&w=${width}&auto=format&fit=crop`;
}
