// @flow
import React, { useState } from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import _ from 'lodash'
import { withStyles } from '../../lib/styles'
import { SaveButton, Section, Wrapper } from '../common'
import InputRounded from '../common/form/InputRounded'
import GDStore from '../../lib/undux/GDStore'
import API from '../../lib/API/api'

import userStorage from '../../lib/gundb/UserStorage'
import { displayNames } from './identities'

const TITLE = 'Add Identity'

// function filterObject(obj) {
//   return pickBy(obj, (v, k) => v !== undefined && v !== '')
// }

const IdentityView = ({ id, onPress, onChange, style, theme }) => (
  <TouchableOpacity onPress={onPress}>
    <Section.Row style={style}>
      <InputRounded
        disabled={true}
        brand={id}
        iconColor={theme.colors.primary}
        iconSize={28}
        onChange={onChange}
        value={'Verify ' + id + ' identity'}
      />
    </Section.Row>
  </TouchableOpacity>
)

const AddIdentityMenu = ({ screenProps, theme, styles }) => {
  const store = GDStore.useStore()
  const storedProfile = store.get('profile')
  const [socialPosts, setSocialPosts] = useState(storedProfile.socialPosts)
  const onAddIdentityPress = name => {
    screenProps.push('GenericSocial', { name, theme, styles })
  }

  const onAddIdentityChange = name => {
    return url => {
      setSocialPosts({ ...socialPosts, [name]: url })
    }
  }

  const renderItem = ({ item }) => {
    return (
      <IdentityView
        theme={theme}
        id={displayNames[item]}
        style={styles.borderedBottomStyle}
        onPress={() => onAddIdentityPress(item)}
        onChange={() => onAddIdentityChange(item)}
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
    userStorage.setSocialPosts(socialPosts)
    API.proposeId({ ...storedProfile, socialPosts: { socialPosts } })
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
