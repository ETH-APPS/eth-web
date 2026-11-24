export const RMB_TRANSFER_RATE = 2_700
export const RMB_TRANSFER_ADMIN_FEE_RMB = 50

export function calculateRmbTransferTotal(amountRmb: number) {
  return (amountRmb + RMB_TRANSFER_ADMIN_FEE_RMB) * RMB_TRANSFER_RATE
}
