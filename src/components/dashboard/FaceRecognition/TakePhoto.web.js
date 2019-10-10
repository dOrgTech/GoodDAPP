// @flow
import React, { createRef } from 'react'

// import { Image } from 'react-native'

// import get from 'lodash/get'
import type { DashboardProps } from '../Dashboard'

import logger from '../../../lib/logger/pino-logger'
import { SaveButton, Section, Wrapper } from '../../common'

// import { fireEvent } from '../../../lib/analytics/analytics'

import { useScreenState } from '../../appNavigation/stackNavigation'

// import FRapi from './FaceRecognitionAPI'

// import type FaceRecognitionResponse from './FaceRecognitionAPI'
import PhotoCapture from './PhotoCapture'

// import { type ZoomCaptureResult } from './Zoom'
// import zoomSdkLoader from './ZoomSdkLoader'

const log = logger.child({ from: 'TakePhoto' })

type TakePhotoProps = DashboardProps & {}

type State = {
  showMsrCapture: boolean,
  showGuidedFR: boolean,
  sessionId: string | void,
  loadingText: string,
  mediaReady: boolean,
  photo: Blob,
  photoURL: DOMString,
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
class TakePhotoClass extends React.Component<TakePhotoProps, State> {
  constructor(props) {
    super(props)
    this.state = {
      showPreText: false,
      showMsrCapture: true,
      showGuidedFR: false,
      sessionId: undefined,
      loadingText: '',
      mediaReady: false,
      captureResult: {},
      isWhitelisted: undefined,
      showHelper: true,
    }
    this.onDone = props.onDone
    this.onCaptureResult = this.onCaptureResult.bind(this)
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

  onCaptureResult = ({ photo, ...dimensions }): void => {
    // this.canvas.0bute('width', this.width)
    // this.canvas.setAttribute('height', this.height)

    // var context = this.canvas.getContext('2d')
    // this.canvas.width = this.width
    // this.canvas.height = this.height
    // this.context.drawImage(this.video, 0, 0, this.width, this.height)

    // var data = canvas.toDataURL('image/png')
    // photo.setAttribute('src', data)

    // log.debug('captureresult')
    // const photo = this.canvas.current.toDataURL('image/png')
    const photoURL = URL.createObjectURL(photo)
    this.setState({ photo, photoURL, ...dimensions })

    // var context = canvas.getContext('2d')
    // context.fillStyle = '#AAA'
    // context.fillRect(0, 0, canvas.width, canvas.height)

    // var data = canvas.toDataURL('image/png')
    // photo.setAttribute('src', data)
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
    log.debug(photo)
  }

  render() {
    const { showMsrCapture } = this.state
    return (
      <Wrapper>
        <Section grow>
          {this.state.photoURL && (
            <img
              id="captured-photo-img"
              src={this.state.photoURL}
              width={this.state.width}
              height={this.state.height}
            />
          )}
          {!this.state.photo && (
            <PhotoCapture
              screenProps={this.props.screenProps}
              onCaptureResult={this.onCaptureResult}
              showMsrCapture={this.state.mediaReady && showMsrCapture}
              loadedZoom={this.loadedZoom}
              onError={this.showFRError}
              showHelper={this.state.showHelper}
            />
          )}
          <Section.Row>
            <SaveButton onPress={() => this.done(this.state.photo)} />
          </Section.Row>
        </Section>
      </Wrapper>
    )
  }
}
const TakePhoto = ({ screenProps }) => {
  const [screenState] = useScreenState(screenProps)
  const { identity } = screenState
  const onDone = photo => {
    log.debug(photo)
    screenProps.pop({ identity: { ...identity, photo } })
  }
  return <TakePhotoClass {...{ ...screenState, onDone }} />
}

TakePhoto.navigationOptions = {
  title: 'Take Photo',
  navigationBarHidden: false,
}
export default TakePhoto
