// @flow
import React, { createRef } from 'react'
import { StyleSheet, View } from 'react-native'
import SimpleStore from '../../../lib/undux/SimpleStore'
import { Camera, CaptureHelperWizard, getResponsiveVideoDimensions } from '../../common'

// import { Section } from '../../common'
import logger from '../../../lib/logger/pino-logger'

const log = logger.child({ from: 'PhotoCapture' })

// TODO: Rami - what is type compared to class?
//TODO: Rami - should I handle onEror and create a class instead of type?

/**
 * Responsible for capturing photo:
 * 1. Uses HTMLVideoElement to draw image on hidden canvas, exports snapshot of canvas into png
 * 2. Triggers callback when png blob is ready
 */
class PhotoCapture extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cameraReady: false,
    }
    this.captureUserMedia = this.captureUserMedia.bind(this)
    log.debug('PhotoCapture')
  }

  videoStream: MediaStream

  cameraReady = async ref => {
    log.debug('camera ready')
    this.videoRef = ref
    this.canvasRef = createRef(HTMLCanvasElement)
    try {
      this.setState(
        { cameraReady: true, width: this.videoRef.current.videoWidth, height: this.videoRef.current.videoHeight },
        () => this.props.store.set('loadingIndicator')({ loading: false })
      )
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
      const context = this.canvasRef.current.getContext('2d')
      context.drawImage(
        this.videoRef.current,
        0,
        0,
        this.videoRef.current.videoWidth,
        this.videoRef.current.videoHeight
      )

      const onCaptureResult = this.props.onCaptureResult
      const dimensions = { width: this.videoRef.current.videoWidth, height: this.videoRef.current.videoHeight }
      const stream = this.videoRef.current.srcObject

      this.canvasRef.current.toBlob(blob => {
        log.debug('png result')

        onCaptureResult({
          photo: blob,
          ...dimensions,
        })
        stream.getTracks().forEach(track => {
          track.stop()
          track.enabled = false
        })
      }, 'image/png')

      // clear
      // context.fillStyle = '#AAA'
      // context.fillRect(0, 0, this.canvas.width, this.canvas.height)

      // var data = canvas.toDataURL('image/png')
      // photo.setAttribute('src', data)
    } catch (e) {
      log.debug('Failed on capture, error:', e.message, e)
      this.props.onError(e)
    }
  }

  componentDidMount() {
    this.props.store.set('loadingIndicator')({ loading: true })
    log.debug('msr capture mounted')
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
          <div id="msr-parent-container" style={getVideoContainerStyles()}>
            <View id="helper" style={styles.helper}>
              {this.state.cameraReady ? (
                <CaptureHelperWizard done={this.captureUserMedia} skip={this.props.showHelper === false} />
              ) : null}
            </View>
            <div id="msr-interface-container" style={{ position: 'absolute' }} />
            <canvas
              ref={this.canvasRef}
              height={this.state.height}
              width={this.state.width}
              style={{ display: 'none' }}
            />
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

export default SimpleStore.withStore(PhotoCapture)
