// @flow
import React, { createRef } from 'react'

// import get from 'lodash/get'
import type { DashboardProps } from '../Dashboard'
// import logger from '../../../lib/logger/pino-logger'
import { Wrapper } from '../../common'

// import { fireEvent } from '../../../lib/analytics/analytics'
import userStorage from '../../../lib/gundb/UserStorage'

// import { useScreenState } from '../../appNavigation/stackNavigation'
// import FRapi from './FaceRecognitionAPI'
import Video from './Video'

// import type FaceRecognitionResponse from './FaceRecognitionAPI'
import GuidedFR from './GuidedFRProcessResults'
import MsrCapture from './MsrCapture'

// import { type ZoomCaptureResult } from './Zoom'
// import zoomSdkLoader from './ZoomSdkLoader'

// const log = logger.child({ from: 'FaceRecognition' })

type FaceRecognitionProps = DashboardProps & {}

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
 * 2. Uses FRapi which is responsible to communicate with GoodServer and UserStorage on FaceRecognition related actions, and handle sucess / failure
 * 3. Display relevant error messages
 * 4. Enables/Disables UI components as dependancy in the state of the process
 **/
class FaceRecognition extends React.Component<FaceRecognitionProps, State> {
  constructor(props) {
    super(props)

    // this.screenState = useScreenState(this.screenProps)
    // this.screenState.onDone = this.screenState.onDone
    this.state = {
      showPreText: false,
      showMsrCapture: true,
      showGuidedFR: false,
      sessionId: undefined,
      loadingText: '',
      video: new Blob([], { type: 'video/webm' }),
      videoUrl: String,
      mediaReady: false,
      captureResult: {},
      isWhitelisted: undefined,
    }
  }

  loadedZoom: any

  timeout: TimeoutID

  containerRef = createRef()

  width = 720

  height = 0

  componentWillUnmount = () => {
    console.log('Unloading ZoomSDK', this.loadedZoom)
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
    console.log({ containerWidth, width: this.width, height: this.height })
  }

  onCaptureResult = (captureResult?: Blob): void => {
    /* do things with image */
    this.video = captureResult
    this.videoURL = URL.createObjectURL(this.video)
  }

  // startFRProcessOnServer = async (captureResult: ZoomCaptureResult) => {
  //   try {
  //     console.log('Sending capture result to server', captureResult)
  //     this.setState({
  //       showMsrCapture: false,
  //       showGuidedFR: true,
  //       sessionId: captureResult.sessionId,
  //     })
  //     let result: FaceRecognitionResponse = await FRapi.performFaceRecognition(captureResult)
  //     console.log('FR API:', { result })
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

  done = () => {
    // fireEvent('FR_Success')
    this.props.screenProps.pop({ isValid: true })
  }

  render() {
    const { showMsrCapture, showGuidedFR, sessionId, isAPISuccess } = this.state
    return (
      <Wrapper>
        {showGuidedFR && (
          <GuidedFR
            sessionId={sessionId}
            userStorage={userStorage}
            retry={this.retry}
            done={this.done}
            navigation={this.props.screenProps}
            isAPISuccess={isAPISuccess}
          />
        )}
        {this.videoUURL && <Video url={this.videoURL} />}
        {this.state.mediaReady && showMsrCapture && !!this.videoURL && (
          <MsrCapture
            screenProps={this.props.screenProps}
            onCaptureResult={this.onCaptureResult}
            showMsrCapture={this.state.mediaReady && showMsrCapture}
            loadedZoom={this.loadedZoom}
            onError={this.showFRError}
            showHelper={this.state.showHelper}
          />
        )}
      </Wrapper>
    )
  }
}

FaceRecognition.navigationOptions = {
  title: 'Face Verification',
  navigationBarHidden: false,
}
export default FaceRecognition
