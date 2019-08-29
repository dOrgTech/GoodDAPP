// @flow
import React, { useCallback, useEffect, useState } from 'react'
import debounce from 'lodash/debounce'
import isEqualWith from 'lodash/isEqualWith'
import isEqual from 'lodash/isEqual'
import { Text } from 'react-native'
import merge from 'lodash/merge'
import pickBy from 'lodash/pickBy'
import BrandIcon from '../common/view/BrandIcon'
import IdentityDataTable from '../identity/IdentityDataTable'
import GDStore from '../../lib/undux/GDStore'
import { useErrorDialog } from '../../lib/undux/utils/dialog'
import { withStyles } from '../../lib/styles'
import { SaveButton, Section, UserAvatar, Wrapper } from '../common'

const TITLE = 'Add Identity'

function filterObject(obj) {
  return pickBy(obj, (v, k) => v !== undefined && v !== '')
}

const supportedIdentities = ['github', 'twitter', 'facebook']

const IdentityView = name => (
  <Section.Row>
    <Text>Verify {name} account</Text>
    <BrandIcon name={name} />
  </Section.Row>
)

const arrayDiff = (a, b) => {
  return a.filter(x => !b.includes(x))
}

const AddIdentity = ({ screenProps, theme, styles }) => {
  const store = GDStore.useStore()
  const storedIdentity = store.get('identity')
  const [identity, setIdentity] = useState(storedIdentity)
  const [saving, setSaving] = useState(false)
  const [isValid, setIsValid] = useState(true)
  const [isPristine, setIsPristine] = useState(true)
  const [errors, setErrors] = useState({})
  const [showErrorDialog] = useErrorDialog()

  //initialize identity value for first time from storedidentity
  useEffect(() => {
    setIdentity(storeIdentity)
  }, [isEqual(identity, {}) && storedIdentity])

  const updateIdentity = async () => {
    store.set('identity')(identity)
  }

  useEffect(() => {
    if (isEqual(storedIdentity, {})) {
      updateIdentity()
    }
  }, [])

  const validate = useCallback(
    debounce(async (identity, storedIdentity, setIsPristine, setErrors, setIsValid) => {
      if (identity && identity.validate) {
        try {
          const pristine = isEqualWith(storedIdentity, identity, (x, y) => {
            if (typeof x === 'function') {
              return true
            }
            if (['string', 'number'].includes(typeof x)) {
              return y && x.toString() === y.toString()
            }
            return undefined
          })
          const { isValid, errors } = identity.validate()

          const { isValid: isValidIndex, errors: errorsIndex } = await userStorage.validateIdentity(
            filterObject(identity)
          )
          const valid = isValid && isValidIndex

          setErrors(merge(errors, errorsIndex))
          setIsValid(valid)
          setIsPristine(pristine)

          return valid
        } catch (e) {
          log.error('validate identity failed', e, e.message)
          showErrorDialog('Unexpected error while validating identity', e)
          return false
        }
      }
      return false
    }, 500),
    []
  )

  const handleIdentityChange = newIdentity => {
    if (saving) {
      return
    }
    setIdentity(newIdentity)
  }

  const handleSaveButton = async () => {
    setSaving(true)

    // with flush triggers immediate call for the validation
    if (!(await validate.flush())) {
      setSaving(false)
      return false
    }

    //create identity only with updated/new fields so we don't resave data
    const toupdate = pickBy(identity, (v, k) => {
      if (typeof v === 'function') {
        return true
      }
      if (storedIdentity[k] === undefined) {
        return true
      }
      if (['string', 'number'].includes(typeof v)) {
        return v.toString() !== storedIdentity[k].toString()
      }
      if (v !== storedIdentity[k]) {
        return true
      }
      return false
    })
    return userStorage
      .setIdentity(toupdate, true)
      .catch(err => {
        log.error('Error saving identity', { err, toupdate })
        showErrorDialog('Unexpected error while saving identity', err)
        return false
      })
      .finally(_ => setSaving(false))
  }

  const onIdentitySaved = () => {
    screenProps.pop()
  }

  // Validate after saving identity state in order to show errors
  useEffect(() => {
    //need to pass parameters into memoized debounced method otherwise setX hooks wont work
    validate(identity, storedIdentity, setIsPristine, setErrors, setIsValid)
  }, [identity])

  return (
    <Wrapper>
      <Section grow>
        {arrayDiff(supportedIdentities, Object.keys(identity)).map(x => (
          <IdentityView key={x} name={x} />
        ))}
      </Section>
    </Wrapper>
  )
}

AddIdentity.navigationOptions = {
  title: TITLE,
}

const getStylesFromProps = ({ theme }) => ({})

export default withStyles(getStylesFromProps)(AddIdentity)
