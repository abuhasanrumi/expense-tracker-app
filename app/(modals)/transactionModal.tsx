import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import Header from '@/components/Header'
import ImageUpload from '@/components/ImageUpload'
import Input from '@/components/Input'
import ModalWrapper from '@/components/ModalWrapper'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/contexts/authContext'
import { deleteWallet } from '@/services/walletService'
import { TransactionType } from '@/types'
import { scale, verticalScale } from '@/utils/styling'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Trash } from 'phosphor-react-native'
import React, { useState } from 'react'
import { Alert, ScrollView, StyleSheet, View } from 'react-native'

const TransactionModal = () => {
  const { user, updateUserData } = useAuth()
  const [transaction, setTransaction] = useState<TransactionType>({
    type: 'expense',
    amount: 0,
    description: '',
    category: '',
    date: new Date(),
    walletId: '',
    image: null
  })
  const router = useRouter()

  const [loading, setLoading] = useState<boolean>(false)

  const oldTransaction: { name: string; image: string; id: string } =
    useLocalSearchParams()

  // useEffect(() => {
  //   if (oldTransaction?.id) {
  //     setTransaction({
  //       name: oldTransaction.name,
  //       image: oldTransaction.image
  //     })
  //   }
  // }, [])

  const onSubmit = async () => {
    // let { name, image } = transaction
    // if (!name.trim() || !image) {
    //   Alert.alert('Wallet', 'Please fill all the fields.')
    //   return
    // }
    // const data: WalletType = {
    //   name,
    //   image,
    //   uid: user?.uid
    // }
    // if (oldTransaction?.id) data.id = oldTransaction.id
    // setLoading(true)
    // const res = await createOrUpdateWallet(data)
    // setLoading(false)
    // if (res.success) {
    //   router.back()
    // } else Alert.alert('Wallet', res.msg)
  }

  const onDelete = async () => {
    if (!oldTransaction?.id) return
    setLoading(true)
    const res = await deleteWallet(oldTransaction.id)
    setLoading(false)
    if (res.success) {
      router.back()
    } else Alert.alert('Wallet', res.msg || 'Something went wrong')
  }

  const showDeleteAlert = () => {
    Alert.alert(
      'Delete Wallet',
      'Are you sure you want to delete this wallet?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete()
        }
      ]
    )
  }

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldTransaction?.id ? 'Update Transaction' : 'New Transaction'}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        <ScrollView
          contentContainerStyle={styles.form}
          showsVerticalScrollIndicator={false}>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Transaction Name</Typo>
            <Input
              placeholder='Salary'
              value={transaction.name}
              onChangeText={(value) =>
                setTransaction({ ...transaction, name: value })
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Transaction Icon</Typo>
            <ImageUpload
              file={transaction.image}
              onClear={() => setTransaction({ ...transaction, image: null })}
              onSelect={(file) =>
                setTransaction({ ...transaction, image: file })
              }
              placeholder='Upload Image'
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        {oldTransaction?.id && !loading && (
          <Button
            onPress={showDeleteAlert}
            style={{
              backgroundColor: colors.rose,
              paddingHorizontal: spacingX._15
            }}>
            <Trash
              color={colors.white}
              size={verticalScale(24)}
              weight='bold'
            />
          </Button>
        )}
        <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
          <Typo color={colors.black} fontWeight={'700'}>
            {oldTransaction?.id ? 'Update Transaction' : 'Add Transaction'}
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  )
}

export default TransactionModal

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1
  },
  form: {
    gap: spacingY._20,
    paddingVertical: spacingY._15,
    paddingBottom: spacingY._40
  },
  inputContainer: {
    gap: spacingY._10
  },
  iosDropDown: {
    flexDirection: 'row',
    height: verticalScale(54),
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: verticalScale(14),
    borderWidth: 1,
    color: colors.white,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: 'continuous',
    paddingHorizontal: spacingX._15
  },
  androidDropDown: {
    height: verticalScale(54),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    fontSize: verticalScale(14),
    color: colors.white,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: 'continuous'
  },
  iosDatePicker: {
    // backgroundColor: "red",
  },
  datePickerButton: {
    backgroundColor: colors.neutral700,
    alignSelf: 'flex-end',
    padding: spacingY._7,
    marginRight: spacingX._7,
    paddingHorizontal: spacingY._15,
    borderRadius: radius._10
  },
  dropdownContainer: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._15,
    borderCurve: 'continuous'
  },
  dropdownItemText: { color: colors.white },
  dropdownSelectedText: {
    color: colors.white,
    fontSize: verticalScale(14)
  },
  dropdownListContainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    borderCurve: 'continuous',
    paddingVertical: spacingY._7,
    top: 5,
    borderColor: colors.neutral500,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5
  },
  dropdownPlaceholder: {
    color: colors.white
  },
  dropdownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._7
  },
  dropdownIcon: {
    height: verticalScale(30),
    tintColor: colors.neutral300
  }
})
