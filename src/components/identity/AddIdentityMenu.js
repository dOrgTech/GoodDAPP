// @flow
import React, { useState } from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import _ from 'lodash'
import { withStyles } from '../../lib/styles'
import { SaveButton, Section, Wrapper } from '../common'
import InputRounded from '../common/form/InputRounded'
import GDStore from '../../lib/undux/GDStore'
import API from '../../lib/API/api'
import { useScreenState } from '../appNavigation/stackNavigation'

import userStorage from '../../lib/gundb/UserStorage'
import { displayNames } from './identities'

const TITLE = 'Add Identity'

// function filterObject(obj) {
//   return pickBy(obj, (v, k) => v !== undefined && v !== '')
// }

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
  const [screenState] = useScreenState(screenProps)
  const { profile: screenProfile } = screenState
  const store = GDStore.useStore()
  const storedProfile = screenProfile ? screenProfile : store.get('privateProfile')

  // console.log('privateprofile')
  // console.dir(storedProfile.validate())
  const [profile] = useState(storedProfile)
  const onAddIdentityPress = name => {
    screenProps.push('GenericSocial', { name, theme, styles, profile })
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

  // const handleVerifyPhoto = () => {
  //   screenProps.push('AddHumanVerification')
  // }
  // const handleVerifyPhotoId = () => {
  //   screenProps.push('AddPhotoId')
  // }

  const handleSave = () => {
    console.log('PROFILE BEING SET')
    console.dir(profile)
    userStorage.setProfile(profile)
    API.proposeId({ ...profile })
  }

  return (
    <Wrapper>
      <Section grow style={styles.Section}>
        <Section.Stack>
          <FlatList
            data={_.difference(Object.keys(displayNames), Object.keys(storedProfile))}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
          />
          {/*
          {!profile.photo && (
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
          {!profile.photoId && (
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
          */}
          <SaveButton disabled={false} onPress={handleSave} onPressDone={() => null} />
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
