import React from 'react'

// import { useScreenState } from '../appNavigation/stackNavigation'
import { getResponsiveVideoDimensions } from '../../common'

export default ({ url, loop }) => {
  // const [screenState] = useScreenState(screenProps)
  console.log('videoo')

  // const { url } = screenState
  const styles = {
    videoElement: {
      ...getResponsiveVideoDimensions(),

      /* REQUIRED - handle flipping of ZoOm interface.  users of selfie-style interfaces are trained to see their mirror image */
      transform: 'scaleX(-1)',
      overflow: 'hidden',
      justifySelf: 'center',
    },
    videoContainer: {
      display: 'grid',
      justifyContent: 'center',
      alignContent: 'center',
      overflow: 'hidden',
    },
  }
  return (
    <>
      <div style={styles.videoContainer}>
        <video id="msr-video-element" autoPlay playsInline src={url} loop={loop} style={styles.videoElement} />
      </div>
    </>
  )
}
