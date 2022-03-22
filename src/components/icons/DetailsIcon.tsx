import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'

import Icon, { IconProps } from '../Icon'

const DetailsIcon: React.FC<IconProps> = ({ color }) => {
  const { color: themeColor } = useContext(ThemeContext)
  return (
    <Icon>Exit</Icon>
  )
}

export default DetailsIcon