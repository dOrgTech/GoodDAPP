// @flow
import React, { createRef } from 'react'
import multihashing from 'multihashing-async'
import CIDTool from 'cid-tool'

// import { Image } from 'react-native'

// import get from 'lodash/get'
import type { DashboardProps } from '../../dashboard/Dashboard'

import logger from '../../../lib/logger/pino-logger'
import { RetryButton, SaveButton, Section, Wrapper } from '../../common'

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
 * Responsible to orchestrate video recording process process, using VideoCapture
 * 1. Loads VideoCapture and receive png Blob - the user video capture result after drawn on invisible canvas and snapshot taken in PhotoCapture.js
 * 2. Display relevant error messages
 * 3. Enables/Disables UI components as dependancy in the state of the process
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
    log.debug('Unloading TakePhoto', this.loadedZoom)
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
    const photoURL = URL.createObjectURL(photo)
    this.setState({ photo, photoURL, ...dimensions })

    // photo clear
    // var context = canvas.getContext('2d')
    // context.fillStyle = '#AAA'
    // context.fillRect(0, 0, canvas.width, canvas.height)

    // var data = canvas.toDataURL('image/png')
    // photo.setAttribute('src', data)
  }

  done = photo => {
    this.onDone(photo)
    log.debug(photo)
  }

  retry = () => {
    this.setState({ photo: null, photoURL: null })
  }

  render() {
    const { showMsrCapture } = this.state
    return (
      <Wrapper>
        <Section grow>
          {this.state.photoURL && (
            // eslint-disable-next-line jsx-a11y/alt-text
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
          <br />
          <br />
          <br />

          <Section.Row>
            <RetryButton onPress={this.retry} />
          </Section.Row>
        </Section>
      </Wrapper>
    )
  }
}
const TakePhoto = ({ screenProps }) => {
  const [screenState] = useScreenState(screenProps)
  const { identity } = screenState
  log.debug('screenstate', screenState)
  const onDone = async photo => {
    const photoBuf = new Buffer(await new Response(photo).arrayBuffer())
    const mh = await multihashing(photoBuf, 'sha2-256')
    identity.form.$.uploads.$.selfie.data = {
      hash: CIDTool.format(mh),
      host: 'gun',
    }
    identity.uploads.photo = photo
    screenProps.pop()
    screenProps.pop({ identity })
  }
  return <TakePhotoClass {...{ ...screenState, onDone }} />
}

TakePhoto.navigationOptions = {
  title: 'Take Photo',
  navigationBarHidden: false,
}
export default TakePhoto
