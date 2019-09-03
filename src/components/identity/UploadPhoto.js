// @flow
import React from 'react'
import CreateAvatar from 'exif-react-avatar-edit'
import { View } from 'react-native'
import { getScreenHeight, getScreenWidth, isPortrait } from '../../lib/utils/Orientation'
import { CustomButton, Section, Wrapper } from '../common'
import GDStore from '../../lib/undux/GDStore'

import { useScreenState } from '../appNavigation/stackNavigation'

import { withStyles } from '../../lib/styles'

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
const UploadPhoto = (props: UploadPhotoProps) => {
  const { screenProps, styles, theme } = props

  const screenWidth = isPortrait() ? getScreenWidth() : getScreenHeight()
  let cropSize = Math.min(screenWidth - 70, 320)

  const store = GDStore.useStore()
  const identity = store.get('identityPhotos')
  const [screenState] = useScreenState(screenProps)

  const { photoType, onChange, onClose } = screenState

  const handlePhotoSubmit = () => {
    identity[photoType] = { photo: null }
    store.set('identityPhotos')(identity)
    screenProps.pop()
    screenProps.pop()
  }

  return (
    <Wrapper>
      <Section style={styles.section}>
        <Section.Row>
          <View style={styles.innerUploadPhoto}>
            <View style={styles.cropContainer}>
              <CreateAvatar
                height={cropSize}
                lineWidth={2}
                minCropRadius={15}
                mobileScaleSpeed={0.01}
                onClose={onClose}
                onCrop={onChange}
                shadingOpacity={0.8}
                src={undefined}
                width={cropSize}
              />
            </View>
          </View>
        </Section.Row>
        <Section.Stack justifyContent="flex-end" grow>
          <CustomButton onPress={handlePhotoSubmit} disabled={false} color={theme.colors.darkBlue}>
            Submit
          </CustomButton>
        </Section.Stack>
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

export default withStyles(getStylesFromProps)(UploadPhoto)
