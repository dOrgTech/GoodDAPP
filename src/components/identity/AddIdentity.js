// @flow
import React from 'react'
import { Clipboard, TouchableOpacity } from 'react-native'

//import GDStore from '../../lib/undux/GDStore'
import { SaveButton, Section, Text, Wrapper } from '../common'
import InputRounded from '../common/form/InputRounded'
import { useScreenState } from '../appNavigation/stackNavigation'
import { withStyles } from '../../lib/styles'

const TITLE = 'Add Identity'

const AddIdentity = ({ screenProps, theme, styles }) => {
  //initialize identity value for first time from storedidentity
  // useEffect(() => {
  //   setIdentity(storeIdentity)
  // }, [isEqual(identity, {}) && storedIdentity])

  // const updateIdentity = async () => {
  //   store.set('identity')(identity)
  // }

  // useEffect(() => {
  //   if (isEqual(storedIdentity, {})) {
  //     updateIdentity()
  //   }
  // }, [])

  // const validate = useCallback(
  //   debounce(async (identity, storedIdentity, setIsPristine, setErrors, setIsValid) => {
  //     if (identity && identity.validate) {
  //       try {
  //         const pristine = isEqualWith(storedIdentity, identity, (x, y) => {
  //           if (typeof x === 'function') {
  //             return true
  //           }
  //           if (['string', 'number'].includes(typeof x)) {
  //             return y && x.toString() === y.toString()
  //           }
  //           return undefined
  //         })
  //         const { isValid, errors } = identity.validate()

  //         const { isValid: isValidIndex, errors: errorsIndex } = await userStorage.validateIdentity(
  //           filterObject(identity)
  //         )
  //         const valid = isValid && isValidIndex

  //         setErrors(merge(errors, errorsIndex))
  //         setIsValid(valid)
  //         setIsPristine(pristine)

  //         return valid
  //       } catch (e) {
  //         log.error('validate identity failed', e, e.message)
  //         showErrorDialog('Unexpected error while validating identity', e)
  //         return false
  //       }
  //     }
  //     return false
  //   }, 500),
  //   []
  // )

  //const store = GDStore.useStore()

  //const identity = store.get('identity')
  const [screenState] = useScreenState(screenProps)

  const { name } = screenState
  const verifyText = 'I am verifying my GoodDollar identity.'

  // const handleIdentityChange = newUsername => {
  //   identity[name] = { username: newUsername }
  // }

  // const handleSaveButton = () => {
  //   store.set('identity')(identity)
  //   return identity[name].username
  // }

  // const onIdentitySaved = () => {
  //   screenProps.pop()
  //   return identity[name].username
  // }
  return (
    <Wrapper>
      <Section grow style={styles.section}>
        <Section.Row>
          <Text>Please make a {name} post with the following:</Text>
        </Section.Row>
        <Section.Row>
          <TouchableOpacity
            onPress={async () => {
              await Clipboard.setString(verifyText)
            }}
          >
            <InputRounded
              disabled={true}
              icon="paste"
              iconColor={theme.colors.primary}
              iconSize={20}
              value={verifyText}
            />
          </TouchableOpacity>
        </Section.Row>
        <Section.Row>
          <InputRounded
            disabled={false}
            icon="send"
            iconColor={theme.colors.primary}
            iconSize={20}
            onChange={() => undefined}
            placeholder="Copy link to post here"
          />
        </Section.Row>
        <Section.Row>
          <SaveButton onPress={() => screenProps.pop()} />
        </Section.Row>
      </Section>
    </Wrapper>
  )
}

AddIdentity.navigationOptions = {
  title: TITLE,
}

const getStylesFromProps = ({ theme }) => ({
  section: {
    flexGrow: 1,
    padding: theme.sizes.defaultDouble,
  },
  iconRight: {
    transform: [{ rotateY: '180deg' }],
  },
})

export default withStyles(getStylesFromProps)(AddIdentity)
