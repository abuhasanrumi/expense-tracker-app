import { TransactionType } from '@/types'

export const createOrUpdateTransaction = async (
  transactionData: Partial<TransactionType>
) => {
  try {
    const { id, type, walletId, amount, image } = transactionData
    if (!amount || amount <= 0 || !type) {
      return {
        success: false,
        msg: 'Invalid transaction data'
      }
    }

    if (id) {
      // todo: update existing transaction
    } else {
      // todo: create new transaction
      // update wallet
  } catch (err: any) {
    console.log('Error creating or updating transaction: ', err)
    return {
      success: false,
      msg: err?.message || "Couldn't create or update transaction"
    }
  }
}
