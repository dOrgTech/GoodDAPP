// @flow
import React, { createRef, useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import { isMobile } from 'mobile-device-detect'
import MediaStreamRecorder from 'msr'
import SimpleStore from '../../../lib/undux/SimpleStore'
import { CustomButton } from '../../common'

// import { Section } from '../../common'
import logger from '../../../lib/logger/pino-logger'
import WebcamGood from '../../../assets/zoom/webcam_good_ok.png'
import WebcamBad from '../../../assets/zoom/webcam_bad_ok.png'
import MobileAngleGood from '../../../assets/zoom/zoom-face-guy-angle-good-phone.png'

// import MobileAngleBad from '../../../assets/zoom/zoom-face-guy-angle-bad-phone.png'
import WebAngleGood from '../../../assets/zoom/zoom-face-guy-angle-good-web.png'

// import WebAngleOk from '../../../assets/zoom/zoom-face-guy-angle-ok-web.png'
// import WebAngleBad from '../../../assets/zoom/zoom-face-guy-angle-bad-web.png'
import LightingBad1 from '../../../assets/zoom/zoom-face-guy-lighting-back-web.png'
import LightingBad2 from '../../../assets/zoom/zoom-face-guy-lighting-side-web.png'
import LightingGood from '../../../assets/zoom/zoom-face-guy-lighting-good-web.png'
import { Camera, getResponsiveVideoDimensions } from './Camera.web'

const log = logger.child({ from: 'MsrCapture' })

// TODO: Rami - what is type compared to class?
//TODO: Rami - should I handle onEror and create a class instead of type?

const HelperWizard = props => {
  const { done, skip } = props
  const [step, setStep] = useState(0)
  const nextStep = () => setStep(step + 1)
  if (skip) {
    return null
  }
  let text, imgs
  switch (step) {
    case 0:
      if (isMobile) {
        nextStep()
      } else {
        text = 'Center your webcam'
        imgs = (
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Image source={WebcamBad} resizeMode={'contain'} style={{ margin: 15, width: '100%', height: 120 }} />
            <Image source={WebcamGood} resizeMode={'contain'} style={{ margin: 15, width: '100%', height: 120 }} />
          </View>
        )
      }
      break
    case 1:
      text = 'Ensure camera is at eye level'
      if (isMobile) {
        imgs = (
          <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Image source={MobileAngleGood} resizeMode={'contain'} style={{ width: '100%', height: 75 }} />
            {/* <Image source={MobileAngleBad} resizeMode={'contain'} style={{ width: '100%', height: 75 }} /> */}
          </View>
        )
      } else {
        imgs = (
          <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Image source={WebAngleGood} resizeMode={'contain'} style={{ width: '100%', height: 75 }} />
            {/* <Image source={WebAngleOk} resizeMode={'contain'} style={{ width: '100%', height: 75 }} />
            <Image source={WebAngleBad} resizeMode={'contain'} style={{ width: '100%', height: 75 }} /> */}
          </View>
        )
      }
      break
    case 2:
      text = 'Light your face evenly'
      imgs = (
        <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Image source={LightingBad2} resizeMode={'contain'} style={{ width: '100%', height: 75 }} />
          <Image source={LightingBad1} resizeMode={'contain'} style={{ width: '100%', height: 75 }} />
          <Image source={LightingGood} resizeMode={'contain'} style={{ width: '100%', height: 75 }} />
        </View>
      )
      break
    case 3:
      done()
      break
  }
  if (step === 3) {
    return null
  }
  return (
    <React.Fragment>
      <View id="background" style={styles.background} />
      <View style={{ zIndex: 10, justifyContent: 'space-evenly', height: '100%' }}>
        <Text fontWeight="medium" fontSize={20} color="surface">
          {text}
        </Text>
        {imgs}
        <CustomButton
          style={{ borderColor: 'white', borderWidth: 2 }}
          mode={'outlined'}
          dark={true}
          onPress={nextStep}
          textStyle={{ color: 'white' }}
        >
          OK
        </CustomButton>
      </View>
    </React.Fragment>
  )
}

/**
 * Responsible for Zoom client SDK triggering:
 * 1. Calls zoom.capture() on the camera capture (Recieved from Camera component)
 * 2. Triggers callback when captureResult is ready
 */
class MsrCapture extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cameraReady: false,
    }
    this.captureUserMediaMsr = this.captureUserMediaMsr.bind(this)
    log.debug('msrcapture')
    this.image = createRef(HTMLImageElement)
    this.canvas = createRef(HTMLCanvasElement)
  }

  videoStream: MediaStream

  cameraReady = async (stream: MediaStream) => {
    log.debug('camera ready')
    this.videoStream = stream
    try {
      // log.debug('zoom initializes capture..')
      // let zoomSDK = this.props.loadedZoom
      // this.zoom = new Zoom(zoomSDK)
      // await this.zoom.ready
      this.setState({ cameraReady: true }, () => this.props.store.set('loadingIndicator')({ loading: false }))
      if (this.props.showHelper === false) {
        await this.captureUserMediaMsr()
      }
    } catch (e) {
      log.error('Failed on capture, error:', e.message, e)
      this.props.onError(e)
    }
  }

  captureUserMediaMsr = async () => {
    log.debug('helper done')
    try {
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
                <HelperWizard done={this.captureUserMediaMsr} skip={this.props.showHelper === false} />
              ) : null}
            </View>
            <div id="msr-interface-container" style={{ position: 'absolute' }} />
            {
              <canvas ref={this.canvas}>
                <Camera key="camera" stream onCameraLoad={this.cameraReady} onError={this.props.onError} />
              </canvas>
            }
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
  background: {
    position: 'absolute',
    top: 0,
    left: -5,
    zIndex: 8,
    borderWidth: 5,
    borderColor: 'white',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(13, 165, 177, 0.5)',
    borderRadius: 5,

    // background:
    //   'linear-gradient(to right, rgba(9, 181, 163, .5), rgba(18, 146, 193, .95)) no-repeat center center fixed',
    backgroundImage: 'linear-gradient(to right, rgba(9, 181, 163, .5), rgba(18, 146, 193, .95))',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundAttachment: 'fixed',
  },
})

const getVideoContainerStyles = () => ({
  ...getResponsiveVideoDimensions(),
  marginLeft: '0',
  marginRight: '0',
  marginTop: 0,
  marginBottom: 0,
})

export default SimpleStore.withStore(MsrCapture)
