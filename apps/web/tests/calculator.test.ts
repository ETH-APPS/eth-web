import assert from 'node:assert/strict'
import test from 'node:test'
import { shippingPriceWhatsappUrl } from '../app/constants/whatsapp.ts'
import {
  CARGO_ESTIMATE_RATES,
  calculateAirCargoEstimate,
  calculateSeaCargoEstimate,
  formatShippingPriceInput,
} from '../app/utils/cargoEstimate.ts'

test('shipping price input groups rupiah digits without changing its numeric value', () => {
  assert.equal(formatShippingPriceInput('3000000'), '3.000.000')
  assert.equal(formatShippingPriceInput('3.000.000'), '3.000.000')
  assert.equal(formatShippingPriceInput('Rp 3,000,000'), '3.000.000')
  assert.equal(Number(formatShippingPriceInput('5500000').replaceAll('.', '')), 5_500_000)
})

test('air cargo uses the entered shipping price per kilogram', () => {
  const estimate = calculateAirCargoEstimate(12, 175_000)

  assert.equal(estimate.ratePerKg, 175_000)
  assert.equal(estimate.totalPrice, 2_100_000)
  assert.equal(calculateAirCargoEstimate(12).ratePerKg, CARGO_ESTIMATE_RATES.airPerKg)
})

test('sea cargo uses the entered shipping price per cubic metre', () => {
  const dimensions = { lengthCm: 100, widthCm: 50, heightCm: 40, boxCount: 5 }
  const estimate = calculateSeaCargoEstimate(dimensions, 4_500_000)

  assert.equal(estimate.totalVolumeCbm, 1)
  assert.equal(estimate.ratePerCbm, 4_500_000)
  assert.equal(estimate.totalPrice, 4_500_000)
  assert.equal(calculateSeaCargoEstimate(dimensions).ratePerCbm, CARGO_ESTIMATE_RATES.seaPerCbm)
})

test('customer service link includes shipping question, selected service, and ETH-WB', () => {
  const url = new URL(shippingPriceWhatsappUrl('Air Cargo'))
  const message = url.searchParams.get('text')

  assert.equal(url.origin, 'https://wa.me')
  assert.match(message ?? '', /harga pengiriman/)
  assert.match(message ?? '', /Jenis layanan: Air Cargo/)
  assert.ok(message?.endsWith('ETH-WB'))
})
