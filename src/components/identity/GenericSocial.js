// @flow
import React, { useState } from 'react'
import { Clipboard, TouchableOpacity } from 'react-native'

import { SaveButton, Section, Text, Wrapper } from '../common'
import InputRounded from '../common/form/InputRounded'
import { useScreenState } from '../appNavigation/stackNavigation'
import { withStyles } from '../../lib/styles'
import { displayNames, postNames } from './identities'
import ShareButton from './ShareButton'

const TITLE = 'Add Identity'

const GenericSocial = ({ screenProps, theme, styles }) => {
  const [screenState] = useScreenState(screenProps)

  const { name, identity } = screenState
  const field = identity.$.socialPosts.$[name]
  const [error, setError] = useState()
  const [post, setPost] = useState()
  const onChange = async url => {
    field.value = url
    const res = await field.validate()
    if (res.hasError) {
      setError(field.error)
    } else {
      setPost(field.value)
      setError()
    }
  }
  const onPress = () => {
    screenProps.pop({ identity })
  }

  const verifyText = 'I am verifying my GoodDollar identity. 0xAb1235019238'

  return (
    <Wrapper>
      <Section grow style={styles.section}>
        <Section.Row style={styles.row}>
          <Text style={styles.instruction}>
            Please make a {displayNames[name]} {postNames[name]} with the text below {'\n'} (tap the clipboard to copy,
            or press share if you{"'"}re on mobile):
          </Text>
        </Section.Row>
        <Section.Row style={styles.row}>
          <TouchableOpacity
            style={styles.clipboardTouch}
            onPress={async () => {
              await Clipboard.setString(verifyText)
            }}
          >
            <InputRounded
              style={styles.clipboard}
              disabled={true}
              icon="paste"
              iconColor={theme.colors.primary}
              iconSize={20}
              value={verifyText}
            />
          </TouchableOpacity>
        </Section.Row>

        <Section.Row style={styles.row} justifyContent="flex-end">
          <ShareButton name={name} style={styles.button} />
        </Section.Row>

        <Section.Row>
          <InputRounded
            error={error != {} && error}
            disabled={false}
            icon="send"
            iconColor={theme.colors.primary}
            iconSize={20}
            onChange={onChange}
            placeholder="Paste link to post here"
            value={post}
          />
        </Section.Row>
        <Section.Row>
          <SaveButton onPress={onPress} />
        </Section.Row>
      </Section>
    </Wrapper>
  )
}

GenericSocial.navigationOptions = {
  title: TITLE,
}

const getStylesFromProps = ({ theme }) => ({
  section: {},

  clipboard: {
    flex: 1,
  },

  clipboardTouch: {
    flex: 1,
  },

  instruction: {
    textAlign: 'center',
  },

  row: {
    marginBottom: 15,
    marginTop: 15,
  },

  iconRight: {},

  button: {
    alignSelf: 'center',
  },
})

export default withStyles(getStylesFromProps)(GenericSocial)
