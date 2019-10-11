// @flow
import React from 'react'
import { StyleSheet, View } from 'react-native'
import SimpleStore from '../../../lib/undux/SimpleStore'
import { Camera, CaptureHelperWizard, getResponsiveVideoDimensions } from '../../common'
import logger from '../../../lib/logger/pino-logger'

const log = logger.child({ from: 'VideoCapture' })

// TODO: Rami - what is type compared to class?
//TODO: Rami - should I handle onEror and create a class instead of type?

/**
 * Responsible for capturing video:
 * 1. Fetches srcObject stream from HTMLElement, uses MediaStreamRecorder to create webm video
 * 2. Triggers callback when webm is ready
 */
class VideoCapture extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cameraReady: false,
    }
    this.captureUserMedia = this.captureUserMedia.bind(this)
    log.debug('VideoCapture')
  }

  videoStream: MediaStream

  cameraReady = async (videoRef: HTMLVideoElement) => {
    log.debug('camera ready')
    this.videoStream = videoRef.current.srcObject
    try {
      this.setState({ cameraReady: true }, () => this.props.store.set('loadingIndicator')({ loading: false }))
      if (this.props.showHelper === false) {
        await this.captureUserMedia()
      }
    } catch (e) {
      log.error('Failed on capture, error:', e.message, e)
      this.props.onError(e)
    }
  }

  captureUserMedia = async () => {
    log.debug('helper done')
    try {
      var mediaRecorder = new MediaRecorder(this.videoStream)
      mediaRecorder.mimeType = 'video/webm'
      const onCaptureResult = this.props.onCaptureResult
      const videoStream = this.videoStream
      mediaRecorder.ondataavailable = function(blob) {
        log.debug('performing video capture')
        onCaptureResult(blob)
        videoStream.getTracks().forEach(track => {
          track.stop()
          track.enabled = false
        })
      }
      mediaRecorder.start(3000)
    } catch (e) {
      log.debug('Failed on capture, error:', e.message, e)
      this.props.onError(e)
    }
  }

  componentDidMount() {
    this.props.store.set('loadingIndicator')({ loading: true })
    log.debug('video capture mounted')
  }

  componentWillUnmount() {
    if (this.state.cameraReady === false) {
      this.props.store.set('loadingIndicator')({ loading: false })
    }
  }

  render() {
    return (
      <View>
        <View style={styles.bottomSection}>
          <div id="video-capture-parent-container" style={getVideoContainerStyles()}>
            <View id="helper" style={styles.helper}>
              {this.state.cameraReady ? (
                <CaptureHelperWizard done={this.captureUserMedia} skip={this.props.showHelper === false} />
              ) : null}
            </View>
            <div id="video-capture-interface-container" style={{ position: 'absolute' }} />
            {<Camera key="camera" onCameraLoad={this.cameraReady} onError={this.props.onError} />}
          </div>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  bottomSection: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 5,
  },
  helper: {
    position: 'absolute',
    top: 0,
    zIndex: 10,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
})

const getVideoContainerStyles = () => ({
  ...getResponsiveVideoDimensions(),
  marginLeft: '0',
  marginRight: '0',
  marginTop: 0,
  marginBottom: 0,
})

export default SimpleStore.withStore(VideoCapture)
