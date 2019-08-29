import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faFacebookSquare, faGithubSquare, faTwitterSquare } from '@fortawesome/free-brands-svg-icons'

const icons = {
  twitter: faTwitterSquare,
  facebook: faFacebookSquare,
  github: faGithubSquare,
}

const BrandIcon = ({ name, ...props }) => <FontAwesomeIcon icon={icons[name]} {...props} />

export default BrandIcon
