import { firestore } from '@/config/firebase'
import { UserDataType } from '@/types'
import { doc, updateDoc } from 'firebase/firestore'

export const updateUser = async (uid: string, updatedData: UserDataType) => {
  try {
    const userRef = doc(firestore, 'users', uid)
    await updateDoc(userRef, updatedData)

    return { success: true, message: 'User updated successfully' }
  } catch (error: any) {
    console.log('Error updating user:', error)
    return { success: false, message: error?.message }
  }
}
