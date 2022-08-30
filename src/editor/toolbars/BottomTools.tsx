import React from 'react';
import AddIcon from '../../component/icons/AddIcon';
import BugIcon from '../../component/icons/BugIcon';
import CameraNextIcon from '../../component/icons/CameraNextIcon';
import ResetCameraIcon from '../../component/icons/CameraResetIcon';
import './BottomTools.scss';

export enum ButtonIds {
  Reset = 'Reset',
  FocusRandom = 'FocusRandom',
  FocusMonitor = 'FocusMonitor'
}

export interface BottomToolsProps {
  callback: (buttonId: string) => void
}
const BottomTools: React.FC<BottomToolsProps> = ({ callback }) => {

  const handleClick = (id: string) => {
    callback(id)
  }
  return (
    <div className='wrapper'>
      <button onClick={() => handleClick('allObjects')}>
        <BugIcon />
      </button>
      <button onClick={() => handleClick('AddNewObj')}>
        <AddIcon />
      </button>
      <button onClick={() => handleClick('AddNewObjToDesk')}>
        <AddIcon />
      </button>
      <button onClick={() => handleClick(ButtonIds.Reset)}>
        <ResetCameraIcon />
      </button>
      <button onClick={() => handleClick(ButtonIds.FocusRandom)}>
        <CameraNextIcon />
      </button>
      {/* <button onClick={() => handleClick(ButtonIds.FocusMonitor)}>Focus Monitor</button> */}
    </div>
  )
}

export default BottomTools;