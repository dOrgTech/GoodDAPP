// @flow
import React, { useState } from 'react'
import { withTheme } from 'react-native-paper'
import { TouchableOpacity } from 'react-native'
import InputRounded from '../../common/form/InputRounded'
import { Section, Text, Wrapper } from '../../common'
import { useScreenState } from '../../appNavigation/stackNavigation'
import logger from '../../../lib/logger/pino-logger'
import Video from '../../common/media/Video'
const log = logger.child({ from: 'Add Selfie' })

const AddMedia = ({ screenProps, theme, styles }) => {
  const [screenState] = useScreenState(screenProps)
  const { identity, media } = screenState
  const [changed, setChanged] = useState(false)
  const [saving, setSaving] = useState(false)
  log.debug(identity)
  log.debug(media)
  const handleUpload = () => {
    log.debug('to upload' + media)
    setChanged(true)
    setSaving(true)
    screenProps.push('UploadMedia', {
      media,
      identity,
    })
  }
  const handleTake = () => {
    log.debug('to take' + media)
    setChanged(true)
    setSaving(true)
    if (media == 'selfie') {
      screenProps.push('TakePhoto', { identity })
    } else if (media == 'video') {
      screenProps.push('TakeVideo', { identity })
    }
  }
  const mediaData = identity.uploads[media]
  let mediaURL = undefined
  if (mediaData) {
    mediaURL = URL.createObjectURL(mediaData)
  }
  const PlayMedia = props => {
    if (mediaURL) {
      if (media === 'video') {
        log.debug('in video')
        return <Video loop url={mediaURL} />
      } else if (media === 'selfie') {
        log.debug('in selfie')
        return <img id="captured-photo-img" src={mediaURL} alt={media} />
      }
    }
    return null
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
            color={theme.colors.darkGray}
          >
            Upload or take a {media} of yourself with the characters {"'"}
            {global.wallet.getAccountForType('gd').slice(0, 8)}
            {"'"} and today{"'"}s date, {"'"}02/09/2019{"'"}, written down on a piece of paper.
          </Text>
        </Section.Row>
        <Section.Row>
          <TouchableOpacity onPress={handleUpload}>
            <InputRounded
              disabled={true}
              iconName={'send'}
              iconColor={theme.colors.primary}
              iconSize={28}
              value={'Upload ' + media}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleTake}>
            <InputRounded
              disabled={true}
              iconName={'camera'}
              iconColor={theme.colors.primary}
              iconSize={28}
              value={'Take ' + media}
            />
          </TouchableOpacity>
        </Section.Row>
        <PlayMedia />
      </Section>
    </Wrapper>
  )
}

export default withTheme(AddMedia)
