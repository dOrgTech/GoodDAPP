import React, { Component } from 'react'
import { Button, Share } from 'react-native'
import { displayNames } from './identities'

class ShareButton extends Component {
  constructor(props) {
    super(props)
    this.name = props.name
  }

  onShare = async () => {
    try {
      const result = await Share.share({
        message: this.post,
      })

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
          // NOTHING
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message)
    }
  }

  render() {
    return <Button onPress={this.onShare} title={'Share to ' + displayNames[this.name]} />
  }
}

export default ShareButton
