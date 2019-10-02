// @flow
import React, { createRef } from 'react'

// import get from 'lodash/get'
import type { DashboardProps } from '../Dashboard'

import logger from '../../../lib/logger/pino-logger'
import { SaveButton, Section, Wrapper } from '../../common'

// import { fireEvent } from '../../../lib/analytics/analytics'

import { useScreenState } from '../../appNavigation/stackNavigation'

// import FRapi from './FaceRecognitionAPI'
import Video from './Video'

// import type FaceRecognitionResponse from './FaceRecognitionAPI'
import MsrCapture from './MsrCapture'

// import { type ZoomCaptureResult } from './Zoom'
// import zoomSdkLoader from './ZoomSdkLoader'

const log = logger.child({ from: 'FaceRecognition' })

type PhotoUploadProps = DashboardProps & {}

type State = {
  showMsrCapture: boolean,
  showGuidedFR: boolean,
  sessionId: string | void,
  loadingText: string,
  facemap: Blob,
  mediaReady: boolean,
  captureResult: ZoomCaptureResult,
  isWhitelisted: boolean | void,
  showHelper: boolean,
}

/**
 * Responsible to orchestrate FaceReco process, using the following modules: ZoomCapture & FRapi.
 * 1. Loads ZoomCapture and recieve ZoomCaptureResult - the user video capture result after processed locally by ZoomSDK (Handled by ZoomCapture)
 * 2. Uses FRapi which is responsible to communicate with GoodServer and UserStorage on PhotoUpload related actions, and handle sucess / failure
 * 3. Display relevant error messages
 * 4. Enables/Disables UI components as dependancy in the state of the process
 **/
class PhotoUpload extends React.Component<PhotoUploadProps, State> {
  constructor(props) {
    super(props)
    this.state = {
      showPreText: false,
      showMsrCapture: true,
      showGuidedFR: false,
      sessionId: undefined,
      loadingText: '',
      video: new Blob([], { type: 'video/webm' }),
      videoURL: undefined,
      mediaReady: false,
      captureResult: {},
      isWhitelisted: undefined,
      showHelper: true,
    }
    this.screenProps = props.screenProps
    const [screenState] = useScreenState(this.screenProps)
    this.screenState = screenState
    this.screenState.onDone = this.screenState.onDone
    this.onCaptureResult = this.onCaptureResult.bind(this)
    this.image = createRef(HTMLImageElement)
    this.canvas = createRef(HTMLCanvasElement)
  }

  loadedZoom: any

  timeout: TimeoutID

  containerRef = createRef()

  width = 720

  height = 0

  componentWillUnmount = () => {
    log.debug('Unloading ZoomSDK', this.loadedZoom)
    this.timeout && clearTimeout(this.timeout)
  }

  componentWillMount = async () => {
    navigator.getMedia =
      navigator.getUserMedia || // use the proper vendor prefix
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia

    navigator.getMedia(
      { video: true },
      () =>
        (this.timeout = setTimeout(() => {
          this.setState({ mediaReady: true })
        }, 0)),
      () => this.setState({ failure: true })
    )
    log.debug('got media')
  }

  componentDidMount = () => {}

  /**
   *  unused
   */
  setWidth = () => {
    const containerWidth =
      (this.containerRef && this.containerRef.current && this.containerRef.current.offsetWidth) || 300
    this.width = Math.min(this.width, containerWidth)
    this.height = window.innerHeight > window.innerWidth ? this.width * 1.77777778 : this.width * 0.5625
    log.debug({ containerWidth, width: this.width, height: this.height })
  }

  onCaptureResult = (): void => {
    log.debug('captureresult')
    const photo = this.canvas.current.toDataURL('image/png')
    this.image.current.setAttribute('src', photo)
    this.setState({ photo })
  }

  // startFRProcessOnServer = async (captureResult: ZoomCaptureResult) => {
  //   try {
  //     log.debug('Sending capture result to server', captureResult)
  //     this.setState({
  //       showMsrCapture: false,
  //       showGuidedFR: true,
  //       sessionId: captureResult.sessionId,
  //     })
  //     let result: PhotoUploadResponse = await FRapi.performPhotoUpload(captureResult)
  //     log.debug('FR API:', { result })
  //     if (!result || !result.ok) {
  //       log.warn('FR API call failed:', { result })
  //       this.showFRError(result.error) // TODO: rami
  //     }

  //     //else if (get(result, 'enrollResult.enrollmentIdentifier', undefined)) {
  //     //   this.setState({ ...this.state, isAPISuccess: true })
  //     // } else {
  //     //   this.setState({ ...this.state, isAPISuccess: false })
  //     // }
  //   } catch (e) {
  //     log.error('FR API call failed:', e.message, e)
  //     this.showFRError(e.message)
  //   }
  // }

  done = photo => {
    this.onDone(photo)
    this.screenProps.pop()
  }

  render() {
    const { showMsrCapture } = this.state
    return (
      <Wrapper>
        <Section grow>
          {this.state.videoURL && <Video loop url={this.state.videoURL} />}
          {!this.state.videoURL && (
            <canvas ref={this.canvas}>
              <MsrCapture
                screenProps={this.props.screenProps}
                onCaptureResult={this.onCaptureResult}
                showMsrCapture={this.state.mediaReady && showMsrCapture}
                loadedZoom={this.loadedZoom}
                onError={this.showFRError}
                showHelper={this.state.showHelper}
              />
            </canvas>
          )}
          <Section.Row>
            <SaveButton onPress={() => this.done(this.state.photo)} />
          </Section.Row>
        </Section>
      </Wrapper>
    )
  }
}

PhotoUpload.navigationOptions = {
  title: 'Face Verification',
  navigationBarHidden: false,
}
export default PhotoUpload
