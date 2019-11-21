// @flow
import React from 'react'
import { withTheme } from 'react-native-paper'
import './index.css'
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

const brands = { Twitter: faTwitter, GitHub: faGithub }

const Icon = ({ brand, ...props }) => {
  return <FontAwesomeIcon icon={brands[brand]} {...props} />
}

type IconProps = {
  name: string,
  color?: string,
  size?: number,
  style?: {},
  theme: Object,
}

export default withTheme(({ theme, color, size, ...props }: IconProps) => (
  <Icon size={size || 16} color={theme.colors[color] || color || theme.colors.primary} {...props} />
))
