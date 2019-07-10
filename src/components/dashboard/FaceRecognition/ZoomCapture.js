// @flow
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Section } from '../../common'
import logger from '../../../lib/logger/pino-logger'
import { Camera, getResponsiveVideoDimensions } from './Camera.web'
import Zoom, { type ZoomCaptureResult } from './Zoom'

const log = logger.child({ from: 'ZoomCapture' })
type ZoomCaptureProps = {
  screenProps: any,
  loadedZoom: boolean,
  showZoomCapture: boolean,
  onCaptureResult: (captureResult?: ZoomCaptureResult) => void,
  onError: (error: string) => void
}

/**
 * Responsible for Zoom client SDK triggering:
 * 1. Calls zoom.capture() on the camera capture (Recieved from Camera component)
 * 2. Triggers callback when captureResult is ready
 */
class ZoomCapture extends React.Component<ZoomCaptureProps> {
  videoTrack: MediaStreamTrack

  zoom: Zoom

  captureUserMediaZoom = async (track: MediaStreamTrack) => {
    this.videoTrack = track
    let captureOutcome: ZoomCaptureResult
    try {
      log.debug('zoom performs capture..')
      let zoomSDK = this.props.loadedZoom
      this.zoom = new Zoom(zoomSDK, track)
      captureOutcome = await this.zoom.capture() // TODO: handle capture errors.
      log.info({ captureOutcome })
      if (captureOutcome) {
        this.props.onCaptureResult(captureOutcome)
      }
    } catch (e) {
      log.error(`Failed on capture, error: ${e}`)
    }
  }

  componentDidMount() {
    if (!this.props.loadedZoom) {
      log.warn('zoomSDK was not loaded into ZoomCapture properly')
    }
  }

  componentWillUnmount() {
    if (this.props.loadedZoom) {
      log.warn('zoomSDK was loaded, canceling zoom capture')
      this.zoom && this.zoom.cancel()
    }
  }

  render() {
    const showZoomCapture = this.props.showZoomCapture
    return (
      showZoomCapture && (
        <View>
          <Section style={styles.bottomSection}>
            <div id="zoom-parent-container" style={getVideoContainerStyles()}>
              <div id="zoom-interface-container" style={{ position: 'absolute' }} />
              {<Camera onCameraLoad={this.captureUserMediaZoom} onError={this.props.onError} />}
            </div>
          </Section>
        </View>
      )
    )
  }
}

const styles = StyleSheet.create({
  bottomSection: {
    flex: 1,
    backgroundColor: '#fff'
  }
})

const getVideoContainerStyles = () => ({
  ...getResponsiveVideoDimensions(),
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: 0,
  marginBottom: 0
})

export default ZoomCapture
