// @flow
import React from 'react'
import { StyleSheet, View } from 'react-native'
import SimpleStore from '../../../lib/undux/SimpleStore'
import { Camera, CaptureHelperWizard, getResponsiveVideoDimensions } from '../../common'

// import { Section } from '../../common'
import logger from '../../../lib/logger/pino-logger'

// import MobileAngleBad from '../../../assets/zoom/zoom-face-guy-angle-bad-phone.png'

// import WebAngleOk from '../../../assets/zoom/zoom-face-guy-angle-ok-web.png'
// import WebAngleBad from '../../../assets/zoom/zoom-face-guy-angle-bad-web.png'

import Zoom, { type ZoomCaptureResult } from './Zoom'

const log = logger.child({ from: 'ZoomCapture' })

// TODO: Rami - what is type compared to class?
//TODO: Rami - should I handle onEror and create a class instead of type?

type ZoomCaptureProps = {
  screenProps: any,
  loadedZoom: boolean,
  onCaptureResult: (captureResult?: ZoomCaptureResult) => void,
  onError: (error: string) => void,
  showHelper: boolean,
}

/**
 * Responsible for Zoom client SDK triggering:
 * 1. Calls zoom.capture() on the camera capture (Recieved from Camera component)
 * 2. Triggers callback when captureResult is ready
 */
class ZoomCapture extends React.Component<ZoomCaptureProps> {
  videoTrack: MediaStreamTrack

  zoom: Zoom

  state = {
    cameraReady: false,
  }

  cameraReady = async (videoRef: HTMLVideoElement) => {
    log.debug('camera ready')
    this.videoStream = videoRef.current.srcObject
    this.videoTrack = this.videoStream.getVideoTracks()[0]
    try {
      log.debug('zoom initializes capture..')
      let zoomSDK = this.props.loadedZoom
      this.zoom = new Zoom(zoomSDK)
      await this.zoom.ready
      this.setState({ cameraReady: true }, () => this.props.store.set('loadingIndicator')({ loading: false }))
      if (this.props.showHelper === false) {
        this.captureUserMediaZoom()
      }
    } catch (e) {
      log.error('Failed on capture, error:', e.message, e)
      this.props.onError(e)
    }
  }

  captureUserMediaZoom = async () => {
    let captureOutcome: ZoomCaptureResult
    try {
      log.debug('zoom performs capture..')
      await this.zoom.ready
      captureOutcome = await this.zoom.capture(this.videoTrack) // TODO: handle capture errors.
      this.videoStream.getTracks().forEach(track => {
        track.stop()
        track.enabled = false
      })
      log.info({ captureOutcome })
      if (captureOutcome) {
        this.props.onCaptureResult(captureOutcome)
      }
    } catch (e) {
      log.error('Failed on capture, error:', e.message, e)
      this.props.onError(e)
    }
  }

  componentDidMount() {
    this.props.store.set('loadingIndicator')({ loading: true })
    if (!this.props.loadedZoom) {
      log.warn('zoomSDK was not loaded into ZoomCapture properly')
    }
  }

  componentWillUnmount() {
    if (this.state.cameraReady === false) {
      this.props.store.set('loadingIndicator')({ loading: false })
    }
    if (this.props.loadedZoom) {
      log.warn('zoomSDK was loaded, canceling zoom capture')
      this.zoom && this.zoom.cancel()
    }
  }

  render() {
    return (
      <View>
        <View style={styles.bottomSection}>
          <div id="zoom-parent-container" style={getVideoContainerStyles()}>
            <View id="helper" style={styles.helper}>
              {this.state.cameraReady ? (
                <CaptureHelperWizard done={this.captureUserMediaZoom} skip={this.props.showHelper === false} />
              ) : null}
            </View>
            <div id="zoom-interface-container" style={{ position: 'absolute' }} />
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

export default SimpleStore.withStore(ZoomCapture)
