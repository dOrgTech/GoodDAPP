// @flow
import React from 'react'
import { FlatList, TouchableOpacity } from 'react-native'

import _ from 'lodash'
import { withStyles } from '../../lib/styles'
import { SaveButton, Section, Text, Wrapper } from '../common'
import InputRounded from '../common/form/InputRounded'
import GDStore from '../../lib/undux/GDStore'
import API from '../../lib/API/api'
import { useScreenState } from '../appNavigation/stackNavigation'
import { IdentityDefinitionForm } from '../../../node_modules/@dorgtech/id-dao-client'
import { useErrorDialog } from '../../lib/undux/utils/dialog'
import { displayNames } from './identities'

// import {SaveButton} from '../common/buttons'

const TITLE = 'Add Identity'

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
  const [screenState] = useScreenState(screenProps)
  const store = GDStore.useStore()
  const storedIdentity = store.get('identity')
  const [showErrorDialog] = useErrorDialog()
  const identityForm = _.hasIn(screenState, 'identity.form') ? screenState.identity.form : new IdentityDefinitionForm()
  const identity = { ...storedIdentity }
  Object.assign(identity)

  if (_.hasIn(screenState, 'identity.form')) {
    if (storedIdentity.json) {
      identityForm.$.data = storedIdentity.json
    }
  }
  if (_.hasIn(screenState, 'identity.videoHash')) {
    Object.assign(storedIdentity, { videoHash: screenState.identity.videoHash })
  }
  if (_.hasIn(screenState, 'identity.photoHash')) {
    Object.assign(storedIdentity, { photo: screenState.identity.photoHash })
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
      identityForm,
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
    const res = await identityForm.$.socialPosts.validate
    if (res.hasError) {
      showErrorDialog(
        _.transform(identityForm.$.socialPosts.$, (acc, val, key) => {
          if (val.error) {
            acc = acc + '\n' + val.error
          }
        })
      )
    } else {
      store.set('identity')({ ...identity })
      let formdata = new FormData()

      formdata.append('product[name]', 'test')
      formdata.append('product[price]', 10)
      formdata.append('product[category_ids][]', 2)
      formdata.append('product[description]', '12dsadadsa')
      formdata.append('product[images_attributes[0][file]]', { uri: identity.photo, name: 'photo', type: 'image/jpeg' })
      API.proposeId({ ...identity })
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
            data={Object.keys(identityForm.$.socialPosts.$)}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            style={styles.spacer}
          />
          <IdentityView
            theme={theme}
            id={'photo'}
            style={styles.borderedBottomStyle}
            onPress={() => screenProps.push('TakePhoto', { from: 'AddIdentityMenu', identityForm })}
          />
          <IdentityView
            theme={theme}
            id={'video'}
            style={styles.borderedBottomStyle}
            onPress={() => screenProps.push('TakeVideo', { from: 'AddIdentityMenu', identityForm })}
          />

            <TouchableOpacity style={styles.borderedBottomStyle} onPress={handleVerifyPhoto}>
              <InputRounded
                disabled={true}
                icon={'send'}
                iconColor={theme.colors.primary}
                iconSize={28}
                value={'Verify with Selfie'}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.borderedBottomStyle} onPress={handleVerifyPhotoId}>
              <InputRounded
                disabled={true}
                icon={'send'}
                iconColor={theme.colors.primary}
                iconSize={28}
                value={'Verify your photo ID'}
              />
            </TouchableOpacity>
          <SaveButton disabled={false} onPress={handleSave} onPressDone={() => null} />
        </Section.Stack>
        <Section.Row style={styles.topMargin}>
          <SaveButton onPress={() => screenProps.pop()} text="Submit Your Identity" />
        </Section.Row>
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
