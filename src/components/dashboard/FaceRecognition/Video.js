import React from 'react'

// import { useScreenState } from '../appNavigation/stackNavigation'
import { getResponsiveVideoDimensions } from './Camera.web'

export default ({ url }) => {
  // const [screenState] = useScreenState(screenProps)
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
        <video id="msr-video-element" autoPlay playsInline src={url} style={styles.videoElement} />
      </div>
    </>
  )
}
