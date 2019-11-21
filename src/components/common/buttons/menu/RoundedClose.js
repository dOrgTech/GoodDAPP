// @flow
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import normalize from '../../../../lib/utils/normalizeText'
import { withStyles } from '../../../../lib/styles'
import Text from '../../view/Text'
import Icon from '../../view/Icon'
import BrandIcon from '../../view/Icon/BrandIcon'
import ErrorText from '../../form/ErrorText'

/**
 * TopBar - used To display contextual information in a small container
 * @param {object} props - an object with props
 * @param {boolean} props.hideBalance - if falsy balance will be displayed
 * @param {function} props.push - pushes a route to the nav stack. When called, apps navigates to the specified ruote
 * @param {React.Node} props.children
 * @returns {React.Node}
 */
const RoundedClose = ({
  styles,
  theme,
  text,
  iconSize,
  iconColor,
  error,
  onPress,
  onClose,
  brand,
  icon,
  ...inputProps
}) => {
  return (
    <View style={styles.inputContainer}>
      <View
        style={inputProps.disabled ? styles.inputText : error ? styles.errorInputContainer : styles.iconInputContainer}
      >
        <TouchableOpacity onPress={onPress}>
          <View style={error ? styles.inputError : styles.input}>
            <Text>{text}</Text>
          </View>
          <View style={styles.suffixIcon}>
            {brand && (
              <BrandIcon
                color={error ? theme.colors.red : iconColor || theme.colors.gray50Percent}
                name={brand}
                size={iconSize}
              />
            )}
            {icon && (
              <Icon
                color={error ? theme.colors.red : iconColor || theme.colors.gray50Percent}
                name={icon}
                size={iconSize}
              />
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose}>
          <View style={styles.closeIcon}>
            <Icon color={theme.colors.red} name={'close'} size={iconSize} />
          </View>
        </TouchableOpacity>
      </View>
      {!inputProps.disabled && <ErrorText error={error} style={styles.errorMargin} />}
    </View>
  )
}

const getStylesFromProps = ({ theme }) => {
  const defaultInputContainer = {
    display: 'flex',
    paddingHorizontal: 32,
    paddingVertical: 0,
    position: 'relative',
    borderRadius: 24,
    borderWidth: 1,
    marginTop: theme.sizes.defaultHalf,
    marginBottom: theme.sizes.default,
  }
  const input = {
    color: theme.colors.darkGray,
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    fontFamily: theme.fonts.default,
    fontSize: normalize(14),
    fontWeight: '400',
    lineHeight: 36,
    display: 'flex',
  }

  return {
    inputContainer: {
      display: 'inline-flex',
      alignContent: 'normal',
      flex: 1,
    },
    errorInputContainer: {
      ...defaultInputContainer,
      borderColor: theme.colors.red,
    },
    iconInputContainer: {
      ...defaultInputContainer,
      borderColor: theme.colors.lightGray,
      marginBottom: theme.sizes.default,
    },
    inputText: {
      ...defaultInputContainer,
      borderBottomColor: 'transparent',
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: theme.colors.lightGray,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      marginBottom: 0,
      marginTop: 2,
      paddingTop: 2,
      paddingBottom: 2,
      alignContent: 'flex-end',
      alignItems: 'flex-end',
    },
    input,
    inputError: {
      ...input,
      color: theme.colors.red,
    },
    suffixIcon: {
      display: 'flex',
      height: '100%',
      position: 'relative',
      width: defaultInputContainer.paddingHorizontal,
      zIndex: 1,
    },
    closeIcon: {
      display: 'flex',
      height: '100%',
      position: 'relative',
      width: defaultInputContainer.paddingHorizontal,
      zIndex: 0,
    },
    error: {
      paddingRight: 0,
      textAlign: 'left',
    },
    errorMargin: {
      marginBottom: theme.sizes.default,
    },
  }
}

export default withStyles(getStylesFromProps)(RoundedClose)
