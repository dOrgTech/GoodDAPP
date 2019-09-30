// @flow
import React from 'react'
import { Clipboard, TouchableOpacity } from 'react-native'

import { SaveButton, Section, Text, Wrapper } from '../common'
import InputRounded from '../common/form/InputRounded'
import { useScreenState } from '../appNavigation/stackNavigation'
import { withStyles } from '../../lib/styles'

const TITLE = 'Add Identity'

const AddIdentity = ({ screenProps, theme, styles }) => {

  const [screenState] = useScreenState(screenProps)

  const { name } = screenState
  const verifyText = 'I am verifying my GoodDollar identity.'

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
