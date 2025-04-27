import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Typo from '../../components/Typo'
import { spacingY, spacingX } from '../../constants/theme'
import { verticalScale } from '@/utils/styling'
import BackButton from '../../components/BackButton'
import { colors } from '@/constants/theme'
import Input from '../../components/Input'
import { At } from 'phosphor-react-native'

const Login = () => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton iconSize={28} />

        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight={'800'}>
            Hey,
          </Typo>
          <Typo size={30} fontWeight={'800'}>
            Welcome Back
          </Typo>
        </View>

        <View style={styles.form}>
          <Typo size={16} color={colors.textLighter}>
            Login now to track all your expenses
          </Typo>
          <Input
            placeholder={'Enter your email'}
            icon={
              <At
                size={verticalScale(26)}
                color={colors.neutral300}
                weight='fill'
              />
            }
          />
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20
  },
  welcomeText: {
    fontSize: verticalScale(20),
    fontWeight: 'bold',
    color: colors.text
  },
  form: {
    gap: spacingY._20
  },
  forgotPassword: {
    textAlign: 'right',
    fontWeight: '500',
    color: colors.text
  },
  footer: {
    flowDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5
  },
  footerText: {
    textAlign: 'center',
    color: colors.text,
    fontSize: verticalScale(15)
  }
})
