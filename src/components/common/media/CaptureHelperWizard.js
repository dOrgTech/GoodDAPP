import React, { useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import { isMobile } from 'mobile-device-detect'
import CustomButton from '../buttons/CustomButton'

// import { Section } from '../../common'
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

const styles = StyleSheet.create({
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
  imageViewWebCam: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageView: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightingBadImage: {
    width: '100%',
    height: '4.6875rem',
  },
  webcamImage: {
    margin: '0.9rem',
    width: '100%',
    height: '7.5rem',
  },

  mobileAngleImage: {
    width: '100%',
    height: '4.6875rem',
  },
})

export default props => {
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
          <View style={styles.imageViewWebCam}>
            <Image source={WebcamBad} resizeMode={'contain'} style={styles.webcamImage} />
            <Image source={WebcamGood} resizeMode={'contain'} style={styles.webcamImage} />
          </View>
        )
      }
      break
    case 1:
      text = 'Ensure camera is at eye level'
      if (isMobile) {
        imgs = (
          <View style={styles.imageView}>
            <Image source={MobileAngleGood} resizeMode={'contain'} style={styles.mobileAngleImage} />
            {/* <Image source={MobileAngleBad} resizeMode={'contain'} style={{ width: '100%', height: 75 }} /> */}
          </View>
        )
      } else {
        imgs = (
          <View style={styles.imageView}>
            <Image source={WebAngleGood} resizeMode={'contain'} style={styles.mobileAngleImage} />
            {/* <Image source={WebAngleOk} resizeMode={'contain'} style={{ width: '100%', height: 75 }} />
            <Image source={WebAngleBad} resizeMode={'contain'} style={{ width: '100%', height: 75 }} /> */}
          </View>
        )
      }
      break
    case 2:
      text = 'Light your face evenly'
      imgs = (
        <View style={styles.imageView}>
          <Image source={LightingBad2} resizeMode={'contain'} style={styles.loghtingBadImage} />
          <Image source={LightingBad1} resizeMode={'contain'} style={styles.loghtingBadImage} />
          <Image source={LightingGood} resizeMode={'contain'} style={styles.loghtingBadImage} />
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