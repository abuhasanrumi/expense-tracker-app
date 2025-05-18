import { firestore } from '@/config/firebase'
import { ResponseType, WalletType } from '@/types'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch
} from 'firebase/firestore'
import { uploadFileToCloudinary } from './imageService'

export const createOrUpdateWallet = async (
  walletData: Partial<WalletType>
): Promise<ResponseType> => {
  try {
    let walletToSave = { ...walletData }
    if (walletData.image) {
      const imageUploadRes = await uploadFileToCloudinary(
        walletData.image,
        'wallets'
      )
      if (!imageUploadRes.success) {
        return {
          success: false,
          message: imageUploadRes.message || 'Failed to upload image'
        }
      }
      walletToSave.image = imageUploadRes.data
    }

    if (!walletData.id) {
      walletToSave.amount = 0
      walletToSave.totalIncome = 0
      walletToSave.totalExpense = 0
      walletToSave.created = new Date()
    }

    const walletRef = walletData?.id
      ? doc(firestore, 'wallets', walletData?.id)
      : doc(collection(firestore, 'wallets'))

    await setDoc(walletRef, walletToSave, { merge: true })
    return { success: true, data: { ...walletToSave, id: walletRef.id } }
  } catch (error) {
    console.log('Error creating or updating wallet', error)
    return { success: false, message: 'Failed to create or update wallet' }
  }
}

export const deleteWallet = async (walletId: string): Promise<ResponseType> => {
  try {
    const walletRef = doc(firestore, 'wallets', walletId)
    await deleteDoc(walletRef)
    deleteTrxByWalletId(walletId)
    return { success: true, message: 'Wallet deleted successfully' }
  } catch (error) {
    console.log('Error deleting wallet', error)
    return { success: false, message: 'Failed to delete wallet' }
  }
}

export const deleteTrxByWalletId = async (
  walletId: string
): Promise<ResponseType> => {
  try {
    let hasMoreTransactions = true

    while (hasMoreTransactions) {
      const transactionQuery = query(
        collection(firestore, 'transactions'),
        where('walletId', '==', walletId)
      )

      const transactionSnapshot = await getDocs(transactionQuery)
      if (transactionSnapshot.size == 0) {
        hasMoreTransactions = false
        break
      }

      const batch = writeBatch(firestore)
      transactionSnapshot.forEach((transactionDoc) => {
        batch.delete(transactionDoc.ref)
      })

      await batch.commit()

      console.log(
        `${transactionSnapshot.size} transactions deleted from wallet ${walletId}`
      )
    }

    return { success: true, message: 'Wallet deleted successfully' }
  } catch (error) {
    console.log('Error deleting wallet', error)
    return { success: false, message: 'Failed to delete wallet' }
  }
}
