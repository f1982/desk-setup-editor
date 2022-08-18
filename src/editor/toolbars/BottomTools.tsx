import React from 'react'
import './BottomTools.scss';

export enum ButtonIds {
  Reset = 'Reset',
  FocusDesk = 'FocusDesk',
  FocusMonitor = 'FocusMonitor'
}

interface BottomToolsProps {
  callback: (buttonId: string) => void
}
const BottomTools: React.FC<BottomToolsProps> = ({ callback }) => {

  const handleClick = (id: string) => {
    callback(id)
  }
  return (
    <div className='wrapper'>
      <button onClick={() => handleClick('allObjects')}>All Objects</button>
      <button onClick={() => handleClick('saveSTL')}>Save STL111</button>
      <button onClick={() => handleClick(ButtonIds.Reset)}>Reset</button>
      <button onClick={() => handleClick(ButtonIds.FocusDesk)}>Focus Desk</button>
      <button onClick={() => handleClick(ButtonIds.FocusMonitor)}>Focus Monitor</button>
    </div>
  )
}

export default BottomTools;