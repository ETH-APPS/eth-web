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

export function formatShippingPriceInput(value: string): string {
  const digits = value.replace(/\D/g, '').replace(/^0+(?=\d)/, '').slice(0, 15)
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export function calculateAirCargoEstimate(
  totalWeightKg: number,
  ratePerKg = CARGO_ESTIMATE_RATES.airPerKg,
): AirCargoEstimate {
  return {
    mode: 'air',
    totalWeightKg,
    ratePerKg,
    totalPrice: totalWeightKg * ratePerKg,
  }
}

export function calculateSeaCargoEstimate(input: {
  lengthCm: number
  widthCm: number
  heightCm: number
  boxCount: number
}, ratePerCbm = CARGO_ESTIMATE_RATES.seaPerCbm): SeaCargoEstimate {
  const volumePerBoxCbm = (input.lengthCm * input.widthCm * input.heightCm) / 1_000_000
  const totalVolumeCbm = volumePerBoxCbm * input.boxCount

  return {
    mode: 'sea',
    ...input,
    volumePerBoxCbm,
    totalVolumeCbm,
    ratePerCbm,
    totalPrice: totalVolumeCbm * ratePerCbm,
  }
}
