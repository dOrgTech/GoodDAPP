// @flow
import React from 'react'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Text } from 'react-native'
import Icon from '../common/view/Icon'
import InputRounded from '../common/form/InputRounded'
import Section from '../common/layout/Section'

import { withStyles } from '../../lib/styles'

const IdentityDataTable = ({ identity, errors: errorsProp, onChange, editable, theme, styles }) => {
  const errors = errorsProp || {}
  return (
    <Section.Row alignItems="center" grow={1}>
      <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }} scrollEnabled={false}>
        {Object.keys(identity).map(
          id =>
            identity[id] && (
              <Section.Row key={id} style={!editable && styles.borderedBottomStyle}>
                <InputRounded
                  disabled={true}
                  error={errors.mobile}
                  brand={id}
                  iconColor={theme.colors.primary}
                  iconSize={28}
                  value={identity[id].username}
                />
                {editable && (
                  <Icon
                    color={theme.colors.primary}
                    name="close"
                    size={28}
                    style={styles.phoneIcon}
                    onPress={onChange ? () => onChange(id) : null}
                  />
                )}
                {errors.mobile && <Text>{errors.mobile}</Text>}
              </Section.Row>
            )
        )}
      </KeyboardAwareScrollView>
    </Section.Row>
  )
}

const getStylesFromProps = ({ theme }) => {
  return {
    borderedBottomStyle: {
      borderBottomColor: theme.colors.lightGray,
      borderBottomWidth: 1,
      overflow: 'none',
    },
    suffixIcon: {
      alignItems: 'center',
      display: 'flex',
      height: 38,
      justifyContent: 'center',
      position: 'absolute',
      right: 0,
      top: 0,
      width: 32,
      zIndex: 1,
    },
    errorMargin: {
      marginTop: theme.sizes.default,
      marginBottom: theme.sizes.default,
    },
  }
}

export default withStyles(getStylesFromProps)(IdentityDataTable)
