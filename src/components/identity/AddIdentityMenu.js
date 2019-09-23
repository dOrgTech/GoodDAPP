// @flow
import React from 'react'
import { FlatList, TouchableOpacity } from 'react-native'

import _ from 'lodash'
import { withStyles } from '../../lib/styles'
import { SaveButton, Section, Wrapper } from '../common'
import InputRounded from '../common/form/InputRounded'
import GDStore from '../../lib/undux/GDStore'
import API from '../../lib/API/api'
import { useScreenState } from '../appNavigation/stackNavigation'

import userStorage from '../../lib/gundb/UserStorage'
import { IdentityDefinitionForm } from '../../../node_modules/@dorgtech/id-dao-client'
import { useErrorDialog } from '../../lib/undux/utils/dialog'
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
  const store = GDStore.useStore()
  const profile = store.get('privateProfile')
  const [showErrorDialog] = useErrorDialog()

  const identity = screenState.identity ? screenState.identity : new IdentityDefinitionForm()
  if (!screenState.identity) {
    identity.$.address.data = '0xfD0174784EbCe943bdb8832Ecdea9Fea30e7C7A9'
  }

  //const [socialPosts, setSocialPosts] = useState({})

  // useEffect(() => {
  //   const valRes = identity.$.socialPosts.validate()
  //   const socialPostErrors = {}
  //   if (valRes.hasError) {
  //     Object.keys(socialPosts).forEach(key => {
  //       socialPostErrors[key] = identity.$.socialPosts.$[key].error
  //     })
  //   }
  //   setSocialPosts(identity)
  // }, [])

  const onAddIdentityPress = name => {
    screenProps.push('GenericSocial', {
      name,
      theme,
      styles,
      identity,
    })
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

  const handleSave = async () => {
    //const res = identity.validate()
    const res = await identity.$.socialPosts.validate
    if (res.hasError) {
      showErrorDialog(
        _.transform(identity.$.socialPosts.$, (acc, val, key) => {
          if (val.error) {
            acc = acc + '\n' + val.error
          }
        })
      )
    } else {
      userStorage.setProfile(profile)
      API.proposeId({ ...profile })
    }
  }

  return (
    <Wrapper>
      <Section grow style={styles.Section}>
        <Section.Stack>
          <FlatList data={Object.keys(identity.$.socialPosts.$)} keyExtractor={keyExtractor} renderItem={renderItem} />
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
