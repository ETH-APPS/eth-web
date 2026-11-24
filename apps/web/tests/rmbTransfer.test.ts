import assert from 'node:assert/strict'
import test from 'node:test'
import {
  RMB_TRANSFER_ADMIN_FEE_RMB,
  RMB_TRANSFER_RATE,
  calculateRmbTransferTotal,
} from '../app/utils/rmbTransfer.ts'

test('adds the RMB admin fee before applying the exchange rate', () => {
  assert.equal(RMB_TRANSFER_ADMIN_FEE_RMB, 50)
  assert.equal(RMB_TRANSFER_RATE, 2_700)
  assert.equal(calculateRmbTransferTotal(1_000), 2_835_000)
  assert.equal(calculateRmbTransferTotal(10_000), 27_135_000)
})
