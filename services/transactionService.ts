import { firestore } from '@/config/firebase'
import { TransactionType, WalletType } from '@/types'
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { uploadFileToCloudinary } from './imageService'

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
      let res = await updateWalletForNewTransaction(
        walletId!,
        Number(amount!),
        type
      )
      if (!res.success) {
        return res
      }

      if (image) {
        // todo: upload image
        const imageUploadRes = await uploadFileToCloudinary(
          image,
          'transactions'
        )
        if (!imageUploadRes.success) {
          return {
            success: false,
            msg: "Couldn't upload image"
          }
        }
        transactionData.image = imageUploadRes.data
      }

      const transactionRef = id
        ? doc(firestore, 'transactions', id)
        : doc(collection(firestore, 'transactions'))

      await setDoc(transactionRef, transactionData, { merge: true })
      return {
        success: true,
        data: { ...transactionData, id: transactionRef.id }
      }
    }
  } catch (err: any) {
    console.log('Error creating or updating transaction: ', err)
    return {
      success: false,
      msg: err?.message || "Couldn't create or update transaction"
    }
  }
}

const updateWalletForNewTransaction = async (
  walletId: string,
  amount: number,
  type: 'income' | 'expense'
) => {
  try {
    // todo: update wallet
    const walletRef = doc(firestore, 'wallets', walletId)
    const walletSnapshot = await getDoc(walletRef)
    if (!walletSnapshot.exists()) {
      console.log('Wallet not found')
      return {
        success: false,
        msg: 'Wallet not found'
      }
    }

    const walletData = walletSnapshot.data() as WalletType

    if (type == 'expense' && walletData.amount! - amount < 0) {
      console.log('Insufficient balance')
      return {
        success: false,
        msg: 'Insufficient balance'
      }
    }

    const updateType = type == 'income' ? 'totalIncome' : 'totalExpense'
    const updatedWalletAmount =
      type == 'income'
        ? Number(walletData.amount) + amount
        : Number(walletData.amount) - amount

    const updatedTotals =
      type == 'income'
        ? Number(walletData.totalIncome) + amount
        : Number(walletData.totalExpense) + amount

    await updateDoc(walletRef, {
      amount: updatedWalletAmount,
      [updateType]: updatedTotals
    })
    return { success: true }
  } catch (err: any) {
    console.log('Error updating wallet: ', err)
    return {
      success: false,
      msg: err?.message || "Couldn't update wallet"
    }
  }
}
