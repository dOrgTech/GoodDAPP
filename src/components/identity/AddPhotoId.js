// @flow
import React, { useState } from 'react'
import { withTheme } from 'react-native-paper'
import { TouchableOpacity } from 'react-native'
import InputRounded from '../common/form/InputRounded'
import { useWrappedUserStorage } from '../../lib/gundb/useWrappedStorage'
import { CustomButton, Section, Wrapper } from '../common'

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
        <Section.Stack justifyContent="flex-end" grow>
          <CustomButton
            disabled={!changed || saving}
            loading={saving}
            onPress={saveAvatar}
            color={theme.colors.darkBlue}
          >
            Upload a picture of your photo id so we can verify you{"'"}re account.
          </CustomButton>
        </Section.Stack>
      </Section>
    </Wrapper>
  )
}

AddHumanVerification.navigationOptions = {
  title: TITLE,
}

export default withTheme(AddHumanVerification)
