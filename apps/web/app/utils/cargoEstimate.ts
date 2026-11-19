export const CARGO_ESTIMATE_RATES = {
  airPerKg: 200_000,
  seaPerCbm: 5_500_000,
} as const

export interface AirCargoEstimate {
  mode: 'air'
  totalWeightKg: number
  ratePerKg: number
  totalPrice: number
}

export interface SeaCargoEstimate {
  mode: 'sea'
  lengthCm: number
  widthCm: number
  heightCm: number
  boxCount: number
  volumePerBoxCbm: number
  totalVolumeCbm: number
  ratePerCbm: number
  totalPrice: number
}

export type CargoEstimate = AirCargoEstimate | SeaCargoEstimate

export function calculateAirCargoEstimate(totalWeightKg: number): AirCargoEstimate {
  return {
    mode: 'air',
    totalWeightKg,
    ratePerKg: CARGO_ESTIMATE_RATES.airPerKg,
    totalPrice: totalWeightKg * CARGO_ESTIMATE_RATES.airPerKg,
  }
}

export function calculateSeaCargoEstimate(input: {
  lengthCm: number
  widthCm: number
  heightCm: number
  boxCount: number
}): SeaCargoEstimate {
  const volumePerBoxCbm = (input.lengthCm * input.widthCm * input.heightCm) / 1_000_000
  const totalVolumeCbm = volumePerBoxCbm * input.boxCount

  return {
    mode: 'sea',
    ...input,
    volumePerBoxCbm,
    totalVolumeCbm,
    ratePerCbm: CARGO_ESTIMATE_RATES.seaPerCbm,
    totalPrice: totalVolumeCbm * CARGO_ESTIMATE_RATES.seaPerCbm,
  }
}
