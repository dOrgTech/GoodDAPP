// @flow
import React from 'react' //  useState
import { FlatList, TouchableOpacity } from 'react-native'
import _ from 'lodash'
import {
  IdentityDefinitionForm,

  //, serialize
} from '@dorgtech/id-dao-client'
import GDStore from '../../lib/undux/GDStore'
import { withStyles } from '../../lib/styles'
import { BrandIcon, CustomButton, SaveButton, Section, Text, Wrapper } from '../common'
import InputRounded from '../common/form/InputRounded'

// import GDStore from '../../lib/undux/GDStore'
import API from '../../lib/API/api'
import { useScreenState } from '../appNavigation/stackNavigation'

import { useDialog } from '../../lib/undux/utils/dialog'
import { useWrappedGoodWallet } from '../../lib/wallet/useWrappedWallet.js'
import logger from '../../lib/logger/pino-logger'
import RoundedClose from '../common/buttons/menu/RoundedClose'
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
      <BrandIcon brand={id} />
    </Section.Row>
  </TouchableOpacity>
)

const UpdateDialogue = ({ onPropose, onUpdate, styles, theme, ...props }) => (
  <Section
    style={{
      flexGrow: 1,
    }}
  >
    <Section.Row justifyContent="space-between" alignItems="flex-start">
      <Text>
        Would you like to update your identity definition registered on the DAO, or would you only like to update your
        stored profile information?
      </Text>
      <CustomButton {...props} compact={true} iconSize={16} onPress={onPropose}>
        <Text> Update on DAO </Text>
      </CustomButton>
      <CustomButton {...props} compact={true} iconSize={16} onPress={onUpdate}>
        <Text> Only update profile information </Text>
      </CustomButton>
    </Section.Row>
  </Section>
)

/*
github, twitter: if already there, expose back button
*keep track of differences*
-to-delete
-to-add
with micro gundb it's just

await Promise.all([toDelete, toAdd])
*/
const AddIdentityMenu = ({ screenProps, theme, styles }) => {
  const [screenState] = useScreenState(screenProps)
  const wallet = useWrappedGoodWallet()
  const store = GDStore.useStore()
  const profile = store.get('profile')
  const [showDialog] = useDialog()

  // const [displayModal, setDisplayModal] = useState(false)

  const { identity } = screenState
  log.debug(_.isEqual(Object.keys(identity), ['mode']))

  if (_.isEqual(Object.keys(identity), ['mode'])) {
    log.debug('equal')
    identity.form = new IdentityDefinitionForm()
    identity.uploads = {}
  }
  log.debug('has address', _.get(identity, 'form.$.address.value'))
  if (_.get(identity, 'form.$.address.value') == '') {
    identity.form.$.address.value = wallet.account
    identity.form.$.name.value = profile.fullName
    log.debug(profile)
    log.debug('add address')
  }
  global.GDidentity = identity

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

  const handleVerifyMedia = media => {
    const title = 'ADD ' + media.toUpperCase()
    log.debug('title', title)
    screenProps.push('AddMedia', {
      from: 'AddIdentityMenu',
      identity,
      media,
      title: 'ADD ' + media.toUpperCase(),
      whydontiseethis: title,
    })
  }

  const handleSave = async () => {
    log.debug('hey save!', identity.mode)

    // //const res = identity.validate()
    // identity.form.$.name.value = profile.fullName
    // identity.form.$.address.value = profile.walletAddress
    // const res = await identity.form.validate()
    // if (res.hasError) {
    //   showErrorDialog(
    //     _.transform(identity.form.$.socialPosts.$, (acc, val, key) => {
    //       if (val.error) {
    //         acc = acc + '\n' + val.error
    //       }
    //     })
    //   )
    // } else {
    // const data = identity.form.data
    let f = false
    if (f) {
      await API.proposeAdd({ form: identity.form.data, uploads: identity.uplaods })
    }

    if (identity.mode === 'add-propose') {
      log.debug('heeey propose')
      const children = [<Text key={0}>add-propose</Text>]
      showDialog({ children, noimage: true })
    } else if (identity.mode == 'add-update') {
      log.debug('heeeey update')
      const children = [<UpdateDialogue key={0} theme={theme} />]
      showDialog({ children, noimage: true })
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
          <TouchableOpacity style={styles.borderedBottomStyle} onPress={() => handleVerifyMedia('video')}>
            <InputRounded
              disabled={true}
              icon={'camera'}
              iconColor={theme.colors.primary}
              iconSize={28}
              value={'Verify with video'}
            />
          </TouchableOpacity>
          <RoundedClose icon={'camera'} text={'Verify your selfie'} onPress={() => handleVerifyMedia('selfie')} />
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
