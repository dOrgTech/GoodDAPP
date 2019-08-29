// @flow
import React from 'react'
import GDStore from '../../lib/undux/GDStore'
import { createStackNavigator } from '../appNavigation/stackNavigation'
import { Section, UserAvatar, Wrapper } from '../common'
import { withStyles } from '../../lib/styles'
import userStorage from '../../lib/gundb/UserStorage'
import IdentityDataTable from '../identity/IdentityDataTable'
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
        <IdentityDataTable identity={ExampleIdentity} editable={editIdentities} />
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

export default createStackNavigator({ Profile, EditProfile, ProfilePrivacy, ViewAvatar, EditAvatar })
