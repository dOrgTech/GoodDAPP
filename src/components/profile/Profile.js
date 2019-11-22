// @flow
import React from 'react'
import GDStore from '../../lib/undux/GDStore'
import { createStackNavigator } from '../appNavigation/stackNavigation'
import { Section, UserAvatar, Wrapper } from '../common'
import { withStyles } from '../../lib/styles'
import AddIdentity from '../identity/AddIdentity'
import AddIdentityMenu from '../identity/AddIdentityMenu'
import AddMedia from '../identity/media/AddMedia'
import GenericSocial from '../identity/GenericSocial'
import IdentityDataTable from '../identity/IdentityDataTable'
import TakePhoto from '../identity/media/TakePhoto.web'
import TakeVideo from '../identity/media/TakeVideo.web'
import EditAvatar from './EditAvatar'
import EditProfile from './EditProfile'
import ProfileDataTable from './ProfileDataTable'
import ProfilePrivacy from './ProfilePrivacy'
import ViewAvatar from './ViewAvatar'
import CircleButtonWrapper from './CircleButtonWrapper'
import VerifyEdit from './VerifyEdit'
import VerifyEditCode from './VerifyEditCode'

const TITLE = 'Profile'

const ProfileWrapper = props => {
  const store = GDStore.useStore()
  const profile = store.get('profile')
  const { screenProps, styles } = props

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
        <ProfileDataTable profile={profile} />
        <CircleButtonWrapper
          iconName={'invite'}
          iconSize={25}
          onPress={() => screenProps.push('AddIdentityMenu', { identity: { mode: 'add-propose' } })}
          style={[styles.iconRight]}
        />
        <CircleButtonWrapper
          iconName={'edit'}
          iconSize={25}
          onPress={() => screenProps.push('AddIdentityMenu', { identity: { mode: 'add-update' } })}
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
  VerifyEdit,
  VerifyEditCode,
  AddIdentity,
  AddIdentityMenu,
  AddMedia,
  GenericSocial,
  IdentityDataTable,
  TakePhoto,
  TakeVideo,
})
