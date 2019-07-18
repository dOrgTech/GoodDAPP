// @flow
import React, { useMemo } from 'react'

import { Section, TopBar, Wrapper } from '../common'
import SummaryTable from '../common/view/SummaryTable'
import { BackButton, useScreenState } from '../appNavigation/stackNavigation'
import { PushButton } from '../appNavigation/PushButton'

import { withStyles } from '../../lib/styles'
import goodWallet from '../../lib/wallet/GoodWallet'
import { generateCode } from '../../lib/share'
import { navigationOptions } from './utils/sendReceiveFlow'

export type ReceiveProps = {
  screenProps: any,
  navigation: any,
  theme: any,
}

const ReceiveAmount = ({ screenProps, ...props }: ReceiveProps) => {
  const [screenState] = useScreenState(screenProps)
  const { params } = props.navigation.state

  const { amount, reason, counterPartyDisplayName } = screenState
  const styles = getStylesFromProps(props)

  const { account, networkId } = goodWallet
  const code = useMemo(() => generateCode(account, networkId, amount, reason, counterPartyDisplayName), [
    account,
    networkId,
    amount,
    reason,
    counterPartyDisplayName,
  ])

  return (
    <Wrapper>
      <TopBar push={screenProps.push} />
      <Section justifyContent="space-between" grow>
        <Section.Title>Summary</Section.Title>
        <SummaryTable
          styles={styles}
          counterPartyDisplayName={counterPartyDisplayName}
          amount={amount}
          reason={reason}
        />
        <Section.Row>
          <Section.Stack grow={1}>
            <BackButton mode="text" screenProps={screenProps}>
              Cancel
            </BackButton>
          </Section.Stack>
          <Section.Stack grow={2}>
            <PushButton
              routeName="Confirmation"
              screenProps={screenProps}
              params={{ reason, amount, code, counterPartyDisplayName, params }}
            >
              Confirm
            </PushButton>
          </Section.Stack>
        </Section.Row>
      </Section>
    </Wrapper>
  )
}

ReceiveAmount.navigationOptions = navigationOptions

ReceiveAmount.shouldNavigateToComponent = props => {
  const { screenState } = props.screenProps
  return screenState.amount
}

const getStylesFromProps = ({ theme }) => {
  return {
    doneButton: {
      marginTop: theme.sizes.default,
    },
  }
}

export default withStyles(getStylesFromProps)(ReceiveAmount)