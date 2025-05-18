import { firestore } from '@/config/firebase'
import { ResponseType, TransactionType, WalletType } from '@/types'
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { uploadFileToCloudinary } from './imageService'

export const createOrUpdateTransaction = async (
  transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
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
      const oldTransactionSnapshot = await getDoc(
        doc(firestore, 'transactions', id)
      )

      const oldTransaction = oldTransactionSnapshot.data() as TransactionType

      const shouldRevertOriginal =
        oldTransaction.type != type ||
        oldTransaction.amount != amount ||
        oldTransaction.walletId != walletId

      if (shouldRevertOriginal) {
        let res = await revertAndUpdateWallets(
          oldTransaction,
          Number(amount),
          type,
          walletId
        )
        if (!res.success) {
          return res
        }
      }
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

const revertAndUpdateWallets = async (
  oldTransaction: TransactionType,
  newTransactionAmount: number,
  newTransactionType: 'income' | 'expense',
  newWalletId: string
) => {
  try {
    const originalWalletSnapshot = await getDoc(
      doc(firestore, 'wallets', oldTransaction.walletId)
    )

    const originalWallet = originalWalletSnapshot.data() as WalletType

    let newWalletSnapshot = await getDoc(doc(firestore, 'wallets', newWalletId))

    let newWallet = newWalletSnapshot.data() as WalletType

    const revertType =
      oldTransaction.type == 'income' ? 'totalIncome' : 'totalExpense'

    const revertIncomeExpense: number =
      oldTransaction.type == 'income'
        ? -Number(oldTransaction.amount)
        : Number(oldTransaction.amount)

    const revertedWalletAmount =
      Number(originalWallet.amount) + revertIncomeExpense
    // wallet amount after the trx is removed

    const revertedIncomeExpenseAmount =
      Number(originalWallet[revertType]) - Number(oldTransaction.amount)

    if (newTransactionType == 'expense') {
      // if user tries to convert income to expense on the same wallet
      // or if the user tried to increase the expense amount and dont have anough balance
      if (
        oldTransaction.waalletId == newWalletId &&
        revertedWalletAmount < newTransactionAmount
      ) {
        return {
          success: false,
          msg: 'Insufficient balance'
        }
      }

      // if user tries  to add expense from a new wallet and the wallet dont have anough balance
      if (newWallet.amount! < newTransactionAmount) {
        return {
          success: false,
          msg: 'Insufficient balance'
        }
      }
    }

    await createOrUpdateWallet({
      id: oldTransaction.walletId,
      amount: revertedWalletAmount,
      [revertType]: revertedIncomeExpenseAmount
    })

    // Refetch the new wallet becasue we just updated it
    newWalletSnapshot = await getDoc(doc(firestore, 'wallets', newWalletId))

    const updateType =
      newTransactionType == 'income' ? 'totalIncome' : 'totalExpense'
    const updatedTransactionAmount: number =
      newTransactionType == 'income'
        ? Number(newTransactionAmount)
        : -Number(newTransactionAmount)

    const newWalletAmount = Number(newWallet.amount) + updatedTransactionAmount

    const newIncomeExpenseAmount = Number(
      newWallet[updateType]! + Number(newTransactionAmount)
    )

    await createOrUpdateWallet({
      id: newWalletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount
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

export const deleteTransaction () => { }