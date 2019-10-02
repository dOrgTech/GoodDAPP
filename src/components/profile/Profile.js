// @flow
import React from 'react'
import GDStore from '../../lib/undux/GDStore'
import { createStackNavigator } from '../appNavigation/stackNavigation'
import { Section, UserAvatar, Wrapper } from '../common'
import { withStyles } from '../../lib/styles'
import IdentityDataTable from '../identity/IdentityDataTable'
import AddIdentityMenu from '../identity/AddIdentityMenu'
import AddIdentity from '../identity/AddIdentity'
import GenericSocial from '../identity/GenericSocial'
import AddHumanVerification from '../identity/AddHumanVerification'
import AddPhotoId from '../identity/AddPhotoId'
import FaceRecognition from '../dashboard/FaceRecognition/FaceRecognition'
import TakePhoto from '../dashboard/FaceRecognition/TakePhoto'

// import UploadPhoto from '../identity/UploadPhoto'
import TakeVideo from '../dashboard/FaceRecognition/TakeVideo.web'
import EditAvatar from './EditAvatar'
import EditProfile from './EditProfile'
import ProfileDataTable from './ProfileDataTable'
import ProfilePrivacy from './ProfilePrivacy'
import ViewAvatar from './ViewAvatar'
import CircleButtonWrapper from './CircleButtonWrapper'

const TITLE = 'Profile'

const ExampleIdentity = {
  github: {
    username: 'github username',
  },
  twitter: {
    username: 'twitter name',
  },
  facebook: {
    username: 'facebook name',
  },
}

const ProfileWrapper = props => {
  const store = GDStore.useStore()
  const profile = store.get('profile')
  const identity = store.get('identity')
  const { screenProps, styles } = props
  const editIdentities = false

  const handleAvatarPress = event => {
    event.preventDefault()
    screenProps.push(`ViewAvatar`)
  }

  return (
    <Wrapper>
      <Section style={styles.section}>
        <Section.Row justifyContent="space-between" alignItems="flex-start">
          <CircleButtonWrapper iconName={'privacy'} iconSize={23} onPress={() => screenProps.push('ProfilePrivacy')} />
          <UserAvatar profile={profile} onPress={handleAvatarPress} />
          <CircleButtonWrapper
            iconName={'edit'}
            iconSize={25}
            onPress={() => screenProps.push('EditProfile')}
            style={[styles.iconRight]}
          />
        </Section.Row>
        <ProfileDataTable profile={profile} identity={ExampleIdentity} />
        <IdentityDataTable identity={identity} editable={editIdentities} />
        <CircleButtonWrapper
          iconName={'invite'}
          iconSize={25}
          onPress={() => screenProps.push('AddIdentityMenu')}
          style={[styles.iconRight]}
        />
      </Section>
    </Wrapper>
  )
}

ProfileWrapper.navigationOptions = {
  title: TITLE,
}

const getStylesFromProps = ({ theme }) => ({
  section: {
    flexGrow: 1,
    padding: theme.sizes.defaultDouble,
  },
  iconRight: {
    transform: [{ rotateY: '180deg' }],
  },
})

const Profile = withStyles(getStylesFromProps)(ProfileWrapper)

export default createStackNavigator({
  Profile,
  EditProfile,
  ProfilePrivacy,
  ViewAvatar,
  EditAvatar,
  AddIdentityMenu,
  AddIdentity,
  GenericSocial,
  FaceRecognition,
  AddHumanVerification,

  // UploadPhoto,
  AddPhotoId,
  TakePhoto,
  TakeVideo,
})
