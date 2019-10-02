// @flow
import React, { useState } from 'react'
import { withTheme } from 'react-native-paper'
import { TouchableOpacity } from 'react-native'
import InputRounded from '../common/form/InputRounded'
import { useWrappedUserStorage } from '../../lib/gundb/useWrappedStorage'
import { Section, Text, Wrapper } from '../common'

const TITLE = 'Upload Photo ID'

const AddHumanVerification = ({ screenProps, theme, styles }) => {
  const wrappedUserStorage = useWrappedUserStorage()
  const [, setAvatar] = useState()
  const [changed, setChanged] = useState(false)
  const [saving, setSaving] = useState(false)

  const saveAvatar = async () => {
    setSaving(true)

    await wrappedUserStorage
    setSaving(false)
    screenProps.pop()
  }

  const handleAvatarChange = avatar => {
    setAvatar(avatar)
    setChanged(true)
  }

  const handleAvatarClose = () => {
    setAvatar(null)
    setChanged(true)
  }

  const handleUploadPhoto = () => {
    screenProps.push('UploadPhoto', { photoType: 'photoId', onChange: handleAvatarChange, onClose: handleAvatarClose })
  }
  const handleTakePhoto = () => {
    screenProps.push('FaceVerification')
  }

  return (
    <Wrapper>
      <Section>
        <Section.Row>
          <Text
            style={{
              color: theme.colors.darkGray,
              textAlign: 'left',
              marginTop: 10,
              marginLeft: 20,
              marginRight: 20,
              marginBottom: 20,
            }}
            disabled={!changed || saving}
            loading={saving}
            onPress={saveAvatar}
            color={theme.colors.darkGray}
          >
            Upload a selfie so we can verify your account.
          </Text>
        </Section.Row>
        <Section.Row>
          <TouchableOpacity onPress={handleUploadPhoto}>
            <InputRounded
              disabled={true}
              iconName={'send'}
              iconColor={theme.colors.primary}
              iconSize={28}
              value={'Upload photo'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleTakePhoto}>
            <InputRounded
              disabled={true}
              iconName={'camera'}
              iconColor={theme.colors.primary}
              iconSize={28}
              value={'Take photo'}
            />
          </TouchableOpacity>
        </Section.Row>
      </Section>
    </Wrapper>
  )
}

AddHumanVerification.navigationOptions = {
  title: TITLE,
}

export default withTheme(AddHumanVerification)
