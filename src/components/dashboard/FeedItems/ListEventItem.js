// @flow
import React from 'react'
import { Avatar } from 'react-native-paper'
import { Text, View } from 'react-native-web'
import BigGoodDollar from '../../common/BigGoodDollar'
import { listStyles } from './EventStyles'
import type { FeedEventProps } from './EventProps'
import EventIcon from './EventIcon'
import EventCounterParty from './EventCounterParty'

/**
 * Render list withdraw item for feed list
 * @param {FeedEventProps} feedEvent - feed event
 * @returns {HTMLElement}
 */
const ListEvent = ({ item: feed }: FeedEventProps) => {
  return (
    <View style={listStyles.innerRow}>
      <View>
        <Avatar.Image size={48} style={{ backgroundColor: 'white' }} source={feed.data.endpoint.avatar} />
        <Text>{`\n`}</Text>
      </View>
      <View style={listStyles.rowData}>
        <EventCounterParty feedItem={feed} />
        <Text style={listStyles.rowDataSubText}>{feed.data.message}</Text>
      </View>
      <View style={[listStyles.row, { borderBottomWidth: 0, marginBottom: 0, padding: 0 }]}>
        <BigGoodDollar number={feed.data.amount} elementStyles={listStyles.currency} />
        <View style={listStyles.rowData}>
          <EventIcon type={feed.type} />
          <Text style={{ fontSize: '8px', color: '#4b4b4b', opacity: 0.8 }}>
            {new Date(feed.date).toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default ListEvent