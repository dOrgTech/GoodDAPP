// @flow
import React from 'react'
import ImagePicker from 'react-native-image-picker'
import { Image, View } from 'react-native'
import _ from 'lodash'
import { getScreenHeight, getScreenWidth, isPortrait } from '../../lib/utils/Orientation'
import { CustomButton, Section, Wrapper } from '../common'
import GDStore from '../../lib/undux/GDStore'
import { useScreenState } from '../appNavigation/stackNavigation'

import { withStyles } from '../../lib/styles'

const TITLE = 'Upload Photo'

export type UploadPhotoProps = {
  profile: {
    avatar: string,
    fullName?: string,
  },
  onChange?: any => mixed,
  onClose?: any => mixed,
  originalSize?: boolean,
  editable?: boolean,
  children?: React.Node,
}

/**
 * Touchable Users UploadPhoto based on UploadPhoto component
 * @param {UploadPhotoProps} props
 * @param {Object} props.profile
 * @param {string} props.profile.avatar
 * @param {string} props.profile.fullName
 * @param {any => mixed} props.onChange
 * @param {any => mixed} props.onClose
 * @param {boolean} props.editable
 * @param {React.Node} props.children
 * @returns {React.Node}
 */

const fileSigTypes = {
  // mp4 4 bytes offset
  mp4: { raw: Buffer.from('667479704D534E56', 'hex'), size: 8, offset: 4 },
  webm: { raw: Buffer.from('1A45DFA3', 'hex'), size: 4, offset: 0 },
  ogg: { raw: Buffer.from('4F67675300020000000000000000', 'hex'), size: 14 },
}

const MAX_SIG_LEN = 20

const UploadPhoto = (props: UploadPhotoProps) => {
  const { screenProps, styles, theme } = props

  const screenWidth = isPortrait() ? getScreenWidth() : getScreenHeight()
  let cropSize = Math.min(screenWidth - 70, 320)

  const store = GDStore.useStore()
  const identity = store.get('identityPhotos')
  const [screenState] = useScreenState(screenProps)
  const [showErrorDialog] = useErrorDialog()
  const { mediaType } = screenState
  const [media, setMedia] = useState(undefined)
  const chooseFile = () => {
    var options = {
      title: 'Select ' + mediaType,
      mediaType,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    }
    ImagePicker.showImagePicker(options, response => {
      const head = Buffer.from(response.data[(0, MAX_SIG_LEN)], 'base64')
      if (mediaType === 'video') {
        _.forEach(fileSigTypes, (val, key) => {
          if (head.subarray(val.offset, val.size).equals(val.raw)) {
            response.type = key
            return false
          }
        })
        if (!response.type) {
          showErrorDialog('incompatible file type') // throw error
        }
      }
      setMedia(response)
    })
  }
  const handlePhotoSubmit = () => {
    identity[mediaType] = media
    screenProps.pop()
    screenProps.pop()
  }

  return (
    <Wrapper>
      <Section style={styles.section}>
        {!media && (
          <Section.Row>
            <View style={styles.innerUploadPhoto}>
              <View style={styles.cropContainer}>
                <CustomButton onPress={chooseFile} disabled={false} color={theme.colors.darkBlue}>
                  upload
                </CustomButton>
              </View>
            </View>
          </Section.Row>
        )}
        {media && (
          <Section.Stack justifyContent="flex-end" grow>
            {mediaType == 'photo' && <Image style={{ width: 50, height: 50 }} source={{ uri: media.uri }} />}
            {mediaType == 'video' && <Video style={{ width: 50, height: 50 }} source={{ uri: media.uri }} />}
            <CustomButton onPress={handlePhotoSubmit} disabled={false} color={theme.colors.darkBlue}>
              Submit
            </CustomButton>
          </Section.Stack>
        )}
      </Section>
    </Wrapper>
  )
}

const getStylesFromProps = ({ theme }) => ({
  avatar: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  innerUploadPhoto: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
  },
  fullNameContainer: {
    marginTop: theme.sizes.default,
  },
  fullName: {
    textAlign: 'left',
  },
  cropContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.paddings.mainContainerPadding,
  },
  section: {
    paddingLeft: '1em',
    paddingRight: '1em',
    flex: 1,
  },
})

UploadPhoto.navigationOptions = {
  title: TITLE,
}

export default withStyles(getStylesFromProps)(UploadPhoto)
