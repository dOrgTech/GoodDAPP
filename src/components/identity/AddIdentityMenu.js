// @flow
import React from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import { withStyles } from '../../lib/styles'
import { Section, Wrapper } from '../common'
import InputRounded from '../common/form/InputRounded'
import GDStore from '../../lib/undux/GDStore'
import { displayNames } from './identities'

const TITLE = 'Add Identity'

// function filterObject(obj) {
//   return pickBy(obj, (v, k) => v !== undefined && v !== '')
// }

const arrayDiff = (a, b) => {
  return a.filter(x => !b.includes(x))
}

const IdentityView = ({ id, onPress, style, theme }) => (
  <TouchableOpacity onPress={onPress}>
    <Section.Row style={style}>
      <InputRounded
        disabled={true}
        brand={id}
        iconColor={theme.colors.primary}
        iconSize={28}
        value={'Verify ' + id + ' identity'}
      />
    </Section.Row>
  </TouchableOpacity>
)

const AddIdentityMenu = ({ screenProps, theme, styles }) => {
  const store = GDStore.useStore()
  const storedIdentity = store.get('identity')
  const identityPhotos = store.get('identityPhotos')

  const onAddIdentityPress = name => {
    screenProps.push('GenericSocial', { name, theme, styles })
  }

  const renderItem = ({ item }) => {
    return (
      <IdentityView
        theme={theme}
        id={displayNames[item]}
        style={styles.borderedBottomStyle}
        onPress={() => onAddIdentityPress(item)}
      />
    )
  }

  const keyExtractor = (item, index) => item

  const handleVerifyPhoto = () => {
    screenProps.push('AddHumanVerification')
  }
  const handleVerifyPhotoId = () => {
    screenProps.push('AddPhotoId')
  }

  return (
    <Wrapper>
      <Section grow style={styles.Section}>
        <Section.Stack>
          <FlatList
            data={arrayDiff(Object.keys(displayNames), Object.keys(storedIdentity))}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
          />
          {!identityPhotos.humanPhoto && (
            <TouchableOpacity onPress={handleVerifyPhoto}>
              <InputRounded
                disabled={true}
                icon={'send'}
                iconColor={theme.colors.primary}
                iconSize={28}
                value={"Verify you're a human through a personal photo"}
              />
            </TouchableOpacity>
          )}
          {!identityPhotos.photoId && (
            <TouchableOpacity onPress={handleVerifyPhotoId}>
              <InputRounded
                disabled={true}
                icon={'send'}
                iconColor={theme.colors.primary}
                iconSize={28}
                value={'Verify your photo ID'}
              />
            </TouchableOpacity>
          )}
        </Section.Stack>
      </Section>
    </Wrapper>
  )
}

AddIdentityMenu.navigationOptions = {
  title: TITLE,
}

const getStylesFromProps = ({ theme }) => {
  return {
    borderedBottomStyle: {
      borderBottomColor: theme.colors.lightGray,
      borderBottomWidth: 1,
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

export default withStyles(getStylesFromProps)(AddIdentityMenu)
