// @flow
import { Dimensions } from 'react-native'
import React, { createRef, useEffect } from 'react'
import { isMobile } from 'mobile-device-detect'

import logger from '../../../lib/logger/pino-logger'

const log = logger.child({ from: 'Camera' })

type CameraProps = {
  width: number,
  height: number,
  onCameraLoad: (track: MediaStreamTrack) => Promise<void>,
  onError: (result: string) => void,

  videoRef?: Boolean,
}

/**
 * Responsible to capture Camera stream
 */
const CameraComp = (props: CameraProps) => {
  let videoPlayerRef = createRef<HTMLVideoElement>()
  const acceptableConstraints: MediaStreamConstraints[] = [
    {
      audio: false,
      video: {
        facingMode: {
          ideal: 'user',
        },
        width: { min: 640 },
        height: { min: 360 },
      },
    },
  ]

  useEffect(() => {
    log.debug('mounting camera', videoPlayerRef)
    if (videoPlayerRef === null) {
      return
    }
    const { width, height } = Dimensions.get('window')
    log.debug({ width, height })

    //prevent landscape
    if (isMobile && width > height) {
      return props.onError('Please make sure your mobile is in portrait mode and try again.')
    }
    awaitGetUserMedia()
  }, [videoPlayerRef])

  const getStream = async (): Promise<MediaStream> => {
    for (let i = 0; i < acceptableConstraints.length; i++) {
      const constraints = acceptableConstraints[i]
      try {
        log.debug('getStream', constraints)
        //eslint-disable-next-line
        let device = await window.navigator.mediaDevices.getUserMedia(constraints)
        log.debug('getStream success:', device)
        return device
      } catch (e) {
        log.error('Failed getting stream', constraints, e)
      }
    }
    let error =
      'Unable to get a video stream. Please ensure you give permission to this website to access your camera, and have a 720p+ camera plugged in'
    log.error('No valid stream found', error)
    throw new Error(error)
  }

  const styles = {
    videoElement: {
      ...getResponsiveVideoDimensions(),

      /* REQUIRED - handle flipping of camera interface.  users of selfie-style interfaces are trained to see their mirror image */
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

  const awaitGetUserMedia = async () => {
    await getUserMedia()
  }

  const getUserMedia = async () => {
    try {
      const stream = await getStream()

      if (!videoPlayerRef || !videoPlayerRef.current) {
        let error = 'No video player found'
        throw new Error(error)
      }
      this.videoTrack = stream
      videoPlayerRef.current.srcObject = stream
      log.debug('getusermedia')
      log.debug(props)
      videoPlayerRef.current.addEventListener('play', () => {
        props.onCameraLoad(videoPlayerRef)
      })
      log.debug('eventlistener done')
    } catch (e) {
      log.debug('getUserMedia failed:', e.message, e)
      props.onError(e)
    }
  }

  return (
    <>
      <div style={styles.videoContainer}>
        <video id="camera-element" autoPlay playsInline ref={videoPlayerRef} style={styles.videoElement} />
      </div>
    </>
  )
}

/* */

export const Camera = React.memo(CameraComp)
export const getResponsiveVideoDimensions = () => {
  const { width, height } = Dimensions.get('window')

  const defaultHeight = height - 124 > 360 && width < 690
  if (isMobile) {
    return {
      height: defaultHeight ? 360 : 'auto',
      maxHeight: defaultHeight ? 360 : height - 124,
      width: defaultHeight ? 'auto' : '100%',
    }
  }
  return {
    height: height * 0.5,
    width: 'auto',
  }
}

export const getResponsiveVideoDimensionsNew = () => {
  const { width, height } = Dimensions.get('window')

  //our max width is 475 and we have (10+5)*2 padding
  const containerWidth = Math.min(475, width) - 30
  const containerHeight = (containerWidth / 2) * 1.77777778

  log.debug({ containerHeight, containerWidth })

  //we transpose the video so height is width
  if (height > containerWidth) {
    return {
      width: 'auto',
      height: containerHeight,
    }
  }
  return {
    width: containerWidth,
    height: 'auto',
  }
}