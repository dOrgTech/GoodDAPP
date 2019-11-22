// @flow
import React, { createRef } from 'react'
import multihashing from 'multihashing-async'
import CIDTool from 'cid-tool'

// import get from 'lodash/get'
import type { DashboardProps } from '../../dashboard/Dashboard'

import logger from '../../../lib/logger/pino-logger'

// import API from '../../../lib/API/api'
import { RetryButton, SaveButton, Section, Wrapper } from '../../common'

// import { fireEvent } from '../../../lib/analytics/analytics'

import { useScreenState } from '../../appNavigation/stackNavigation'

// import FRapi from './FaceRecognitionAPI'
import Video from '../../common/media/Video'

// import type FaceRecognitionResponse from './FaceRecognitionAPI'
import MsrCapture from './VideoCapture'

// import { type ZoomCaptureResult } from './Zoom'
// import zoomSdkLoader from './ZoomSdkLoader'

const log = logger.child({ from: 'TakeVideo' })

type TakeVideoProps = DashboardProps & {}

type State = {
  showMsrCapture: boolean,
  showGuidedFR: boolean,
  sessionId: string | void,
  loadingText: string,
  mediaReady: boolean,
  video: Blob,
  videoURL: DOMString,
  captureResult: ZoomCaptureResult,
  isWhitelisted: boolean | void,
  showHelper: boolean,
}

/**
 * Responsible to orchestrate video recording process process, using VideoCapture
 * 1. Loads VideoCapture and receive video Blob - the user video capture result after recording by MediaStream in VideoCapture.js
 * 2. Display relevant error messages
 * 3. Enables/Disables UI components as dependancy in the state of the process
 **/
class TakeVideoClass extends React.Component<TakeVideoProps, State> {
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

    this.onDone = props.onDone
    this.onCaptureResult = this.onCaptureResult.bind(this)
  }

  loadedZoom: any

  timeout: TimeoutID

  containerRef = createRef()

  width = 720

  height = 0

  componentWillUnmount = () => {
    log.debug('Unloading TakeVideo')
    this.timeout && clearTimeout(this.timeout)
  }

  componentWillMount = () => {
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

  onCaptureResult = (captureResult?: Blob): void => {
    log.debug('webm capture result', captureResult)

    /* creates URL and adds video and URL to state */
    const video = captureResult
    const videoURL = URL.createObjectURL(video)
    this.setState({ videoURL, video })
  }

  done = video => {
    this.onDone(video)
  }

  retry = () => {
    this.setState({ video: null, videoURL: null })
  }

  render() {
    const { showMsrCapture } = this.state
    return (
      <Wrapper>
        <Section grow>
          {this.state.videoURL && <Video loop url={this.state.videoURL} />}
          {!this.state.videoURL && (
            <MsrCapture
              screenProps={this.props.screenProps}
              onCaptureResult={this.onCaptureResult}
              showMsrCapture={this.state.mediaReady && showMsrCapture}
              loadedZoom={this.loadedZoom}
              onError={this.showFRError}
              showHelper={this.state.showHelper}
            />
          )}
          <Section.Row>
            <SaveButton onPress={() => this.done(this.state.video)} />
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

const TakeVideo = ({ screenProps }) => {
  const [screenState] = useScreenState(screenProps)
  const { identity } = screenState
  const onDone = async video => {
    const videoBuf = new Buffer(await new Response(video).arrayBuffer())
    const mh = await multihashing(videoBuf, 'sha2-256')
    identity.form.$.uploads.$.video.data = {
      hash: CIDTool.format(mh),
      host: 'gun',
    }
    identity.uploads.video = video
    screenProps.pop()
    screenProps.pop({ identity })
  }
  return <TakeVideoClass {...{ ...screenState, onDone }} />
}

TakeVideo.navigationOptions = {
  title: 'Take Video',
  navigationBarHidden: false,
}
export default TakeVideo
