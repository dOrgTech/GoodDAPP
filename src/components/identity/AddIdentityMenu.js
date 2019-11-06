// @flow
import React from 'react'
import { FlatList, TouchableOpacity } from 'react-native'

import _ from 'lodash'
import { IdentityDefinitionForm, serialize } from '@dorgtech/id-dao-client'
import { withStyles } from '../../lib/styles'
import { SaveButton, Section, Text, Wrapper } from '../common'
import InputRounded from '../common/form/InputRounded'
import GDStore from '../../lib/undux/GDStore'
import API from '../../lib/API/api'
import { useScreenState } from '../appNavigation/stackNavigation'
import { useErrorDialog } from '../../lib/undux/utils/dialog'

import logger from '../../lib/logger/pino-logger'
import { displayNames } from './identities'
const log = logger.child({ from: 'AddIdentityMenu' })

// import {SaveButton} from '../common/buttons'

const TITLE = 'Add Identity'

// const arrayDiff = (a, b) => {
//   return a.filter(x => !b.includes(x));
// };

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
  const profile = store.get('profile')
  const [showErrorDialog] = useErrorDialog()
  const { identity: identityState } = screenState
  log.debug('id state', identityState)
  const identity: { form: IdentityDefinitionForm } = identityState
    ? identityState
    : { form: new IdentityDefinitionForm(), uploads: {} }

  // identity.form.$.address.value = global.wallet.account
  log.debug('has address', _.get(identity, 'form.$.address.value'))
  if (_.get(identity, 'form.$.address.value') == '') {
    // identity.form.$.address.value = global.wallet.account
    identity.form.$.address.value = '0xfD0174784EbCe943bdb8832Ecdea9Fea30e7C7A9'
    log.debug('add address')
  }
  global.GDidentity = identity
  log.debug(identity)
  log.debug('has address2', _.has(identity, 'form.$.address.value'))

  // const identity = { ...storedIdentity }
  // Object.assign(identity)

  // if (_.hasIn(screenState, 'identity.form')) {
  //   if (storedIdentity.json) {
  //     identity.form.$.data = storedIdentity.json
  //   }
  // }
  // if (_.hasIn(screenState, 'identity.videoHash')) {
  //   Object.assign(storedIdentity, { videoHash: screenState.identity.videoHash })
  // }
  // if (_.hasIn(screenState, 'identity.photoHash')) {
  //   Object.assign(storedIdentity, { photo: screenState.identity.photoHash })
  // }

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

  const handleVerifyPhoto = () => {
    screenProps.push('TakeVideo', { from: 'AddIdentityMenu', identity })
  }

  const handleVerifyPhotoId = () => {
    screenProps.push('AddPhotoId', { from: 'AddIdentityMenu', identity })
  }

  const handleSave = async () => {
    //const res = identity.validate()
    identity.form.$.name.value = profile.fullName
    identity.form.$.address.value = profile.walletAddress
    const res = await identity.form.validate()
    if (res.hasError) {
      showErrorDialog(
        _.transform(identity.form.$.socialPosts.$, (acc, val, key) => {
          if (val.error) {
            acc = acc + '\n' + val.error
          }
        })
      )
    } else {
      const data = identity.form.data
      API.proposeId(serialize(data))
    }
  }
  return (
    <Wrapper>
      <Section style={styles.Section}>
        <Section.Row>
          <Text style={styles.introText}>
            Please add as many forms of identity verification as per your comfort level. {'\n\n'}The more forms of
            verification, the more likely your profile will be accepted into the Identity Registry.
          </Text>
        </Section.Row>
        <Section.Stack>
          <FlatList
            data={Object.keys(identity.form.$.socialPosts.$)}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            style={styles.spacer}
          />
          <TouchableOpacity style={styles.borderedBottomStyle} onPress={handleVerifyPhoto}>
            <InputRounded
              disabled={true}
              icon={'send'}
              iconColor={theme.colors.primary}
              iconSize={28}
              value={'Verify with video'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.borderedBottomStyle} onPress={handleVerifyPhotoId}>
            <InputRounded
              disabled={true}
              icon={'send'}
              iconColor={theme.colors.primary}
              iconSize={28}
              value={'Verify your selfie'}
            />
          </TouchableOpacity>
          <Section.Row style={styles.borderedBottomStyle}>
            <SaveButton onPress={handleSave} text="Submit Your Identity" />
          </Section.Row>
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
      marginBottom: 8,
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
    introText: {
      textAlign: 'left',
      marginBottom: 20,
      marginLeft: 20,
      marginRight: 20,
      marginTop: 10,
    },
    errorMargin: {
      marginTop: theme.sizes.default,
      marginBottom: theme.sizes.default,
    },
    topMargin: {
      marginTop: 10,
    },
  }
}

export default withStyles(getStylesFromProps)(AddIdentityMenu)
