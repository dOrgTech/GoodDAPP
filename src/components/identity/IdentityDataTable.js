import React from 'react'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Text } from 'react-native'

//import { Alert, Modal, Text, TouchableHighlight, View } from 'react-native'
import Icon from '../common/view/Icon'
import BrandIcon from '../common/view/BrandIcon'

//import InputRounded from '../common/form/InputRounded'
import Section from '../common/layout/Section'

import { withStyles } from '../../lib/styles'

// class ModalExample extends Component {
//   state = {
//     modalVisible: false,
//   }

//   setModalVisible(visible) {
//     this.setState({ modalVisible: visible })
//   }

//   render() {
//     return (
//       <View style={{ marginTop: 22 }}>
//         <Modal
//           animationType="slide"
//           transparent={false}
//           visible={this.state.modalVisible}
//           onRequestClose={() => {
//             Alert.alert('Modal has been closed.')
//           }}
//         >
//           <View style={{ marginTop: 22 }}>
//             <View>
//               <Text>Hello World!</Text>

//               <TouchableHighlight
//                 onPress={() => {
//                   this.setModalVisible(!this.state.modalVisible)
//                 }}
//               >
//                 <Text>Hide Modal</Text>
//               </TouchableHighlight>
//             </View>
//           </View>
//         </Modal>

//         <TouchableHighlight
//           onPress={() => {
//             this.setModalVisible(true)
//           }}
//         >
//           <Text>Show Modal</Text>
//         </TouchableHighlight>
//       </View>
//     )
//   }
// }

const IdentityDataTable = ({ identity, errors: errorsProp, editable, theme, styles }) => {
  const errors = errorsProp || {}
  return (
    <Section.Row alignItems="center" grow={1}>
      <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }} scrollEnabled={false}>
        {Object.keys(identity).map(x => (
          <Section.Row key={x} style={!editable && styles.borderedBottomStyle}>
            <BrandIcon name={x} />
            <Text>{identity[x].username}</Text>
            {editable && (
              <Icon
                color={theme.colors.primary}
                name="twitter-square"
                size={28}
                style={styles.phoneIcon}
                onPress={() => delete identity[x]}
              />
            )}
            {errors.mobile && <Text>{errors.mobile}</Text>}
          </Section.Row>
        ))}
      </KeyboardAwareScrollView>
    </Section.Row>
  )
}

const getStylesFromProps = ({ theme }) => {
  return {
    borderedBottomStyle: {
      borderBottomColor: theme.colors.lightGray,
      borderBottomWidth: 1,
    },
    suffixIcon: {
      alignItems: 'center',
      display: 'flex',
      height: 38,
      justifyContent: 'center',
      position: 'absolute',
      right: 0,
      top: 0,
      width: 32,
      zIndex: 1,
    },
    errorMargin: {
      marginTop: theme.sizes.default,
      marginBottom: theme.sizes.default,
    },
  }
}

export default withStyles(getStylesFromProps)(IdentityDataTable)
