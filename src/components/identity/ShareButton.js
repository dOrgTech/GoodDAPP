import React, { Component } from 'react'
import { Button, Share } from 'react-native'

class ShareButton extends Component {
  onShare = async () => {
    try {
      const result = await Share.share({
        message: 'THIS IS WHERE WE CAN PRELOAD THE COPYPASTA',
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
    return <Button onPress={this.onShare} title="Share to ${name}" />
  }
}

export default ShareButton
