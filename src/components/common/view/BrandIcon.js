import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faFacebookSquare, faGithubSquare, faLinkedin, faTwitterSquare } from '@fortawesome/free-brands-svg-icons'

const icons = {
  twitter: faTwitterSquare,
  facebook: faFacebookSquare,
  github: faGithubSquare,
  linkedin: faLinkedin,
}

const BrandIcon = ({ name, ...props }) => <FontAwesomeIcon icon={icons[name]} {...props} />

export default BrandIcon
