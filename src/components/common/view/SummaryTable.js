import React from 'react'
import normalize from 'react-native-elements/src/helpers/normalizeText'

import Section from '../layout/Section'
import { withStyles } from '../../../lib/styles'
import BigGoodDollar from './BigGoodDollar'

const FromRow = props => {
  const { styles, counterPartyDisplayName } = props
  if (!counterPartyDisplayName) {
    return null
  }

  return (
    <Section.Row style={styles.tableRow}>
      <Section.Text style={styles.tableRowLabel}>From:</Section.Text>
      <Section.Text fontSize={24} fontWeight="bold">
        {counterPartyDisplayName}
      </Section.Text>
    </Section.Row>
  )
}

const AmountRow = props => {
  const { amount, styles } = props
  if (!amount) {
    return null
  }
  return (
    <Section.Row style={styles.tableRow}>
      <Section.Text style={styles.tableRowLabel}>Amount:</Section.Text>
      <BigGoodDollar elementStyles={styles.bigGoodDollar} number={amount} color={styles.bigGoodDollar.color} />
    </Section.Row>
  )
}

const ReasonRow = props => {
  const { reason, styles } = props
  if (!reason) {
    return null
  }
  return (
    <Section.Row style={styles.tableRow}>
      <Section.Text style={styles.tableRowLabel}>For:</Section.Text>
      <Section.Text fontSize={16}>{reason}</Section.Text>
    </Section.Row>
  )
}

const SummaryTable = ({ styles, counterPartyDisplayName, amount, reason }) => (
  <Section.Stack grow justifyContent="center">
    <FromRow counterPartyDisplayName={counterPartyDisplayName} styles={styles} />
    <AmountRow amount={amount} styles={styles} />
    <ReasonRow reason={reason} styles={styles} />
  </Section.Stack>
)

const getStylesFromProps = ({ theme }) => {
  return {
    tableRow: {
      // TODO: see where should we take this color from
      borderBottomColor: theme.colors.gray50Percent,
      borderBottomWidth: normalize(1),
      borderBottomStyle: 'solid',
      marginTop: theme.sizes.defaultDouble,
      alignItems: 'baseline',
      paddingBottom: theme.sizes.default,
    },

    // TODO: all this properties can be removed once we merge Text component in
    tableRowLabel: {
      color: '#A3A3A3',
    },
    bigGoodDollar: {
      color: theme.colors.primary,
      fontSize: normalize(24),
      fontFamily: theme.fonts.bold,
    },
    reason: {
      fontSize: normalize(16),
    },
  }
}

export default withStyles(getStylesFromProps)(SummaryTable)