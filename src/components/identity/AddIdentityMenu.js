// @flow
import React from 'react'

import { FlatList, Text, TouchableOpacity } from 'react-native'
import BrandIcon from '../common/view/BrandIcon'
import { withStyles } from '../../lib/styles'
import { Section, Wrapper } from '../common'
import GDStore from '../../lib/undux/GDStore'

const TITLE = 'Add Identity'

// function filterObject(obj) {
//   return pickBy(obj, (v, k) => v !== undefined && v !== '')
// }

const supportedIdentities = ['github', 'twitter', 'facebook']

const arrayDiff = (a, b) => {
  return a.filter(x => !b.includes(x))
}

const IdentityView = ({ id, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Text>Verify {id} account</Text>
    <BrandIcon name={id} />
  </TouchableOpacity>
)

const AddIdentityMenu = ({ screenProps, theme, styles }) => {
  const store = GDStore.useStore()
  const storedIdentity = store.get('identity')
  const onPressItem = id => id

  const renderItem = ({ item }) => <IdentityView id={item} onPressItem={() => onPressItem(item)} />

  const keyExtractor = (item, index) => item

  return (
    <Wrapper>
      <Section grow>
        <Section.Stack>
          <FlatList
            data={arrayDiff(supportedIdentities, Object.keys(storedIdentity))}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
          />
          <Text>{arrayDiff(supportedIdentities, Object.keys(storedIdentity))}</Text>
        </Section.Stack>
      </Section>
    </Wrapper>
  )
}

AddIdentityMenu.navigationOptions = {
  title: TITLE,
}

const getStylesFromProps = ({ theme }) => ({})

export default withStyles(getStylesFromProps)(AddIdentityMenu)
