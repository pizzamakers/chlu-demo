import React from 'react'
import PropType from 'prop-types'
// components
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import SwapHoriz from 'material-ui/svg-icons/action/swap-horiz'
import IconButton from 'material-ui/IconButton'

const iconStyle = {
  color: 'white',
  cursor: 'pointer'
}

const listStyle = {
  textAlign: 'left'
}

const SwitchUserMenu = ({ items, isOpen, onRequestChange, onItemClick }) => (
  <IconMenu
    iconButtonElement={<IconButton iconStyle={iconStyle}><SwapHoriz /></IconButton>}
    open={isOpen}
    onRequestChange={onRequestChange}
    listStyle={listStyle}
  >
    {
      items.map((user, index) =>
        <MenuItem value={user} primaryText={user} onClick={() => onItemClick(user)} key={index} />)
    }
  </IconMenu>
)


SwitchUserMenu.propType = {
  items: PropType.array.isRequired,
  isOpen: PropType.bool.isRequired,
  onRequestChange: PropType.func.isRequired,
  onItemClick: PropType.func.isRequired
}

export default SwitchUserMenu
