
import React from 'react';
import { Link } from 'react-router-dom';
import ResetCameraIcon from '../../component/icons/CameraNextIcon';
import './LeftToolBar.scss'

const ToolBar: React.FC<{ callback: () => void }> = ({ callback }) => {

  const handleClick = (toolItemId: string) => {
    console.log('toolItemId', toolItemId);

  }
  return (
    <div className='tool-container'>
      <div className="bar-title">Tool</div>
      <div className='bar-buttons'>
        <button onClick={() => handleClick('test')}>
          <ResetCameraIcon />
        </button>
        <button onClick={() => handleClick('test2')}>
          <ResetCameraIcon />
        </button>
        <button onClick={() => handleClick('test3')}>
          <ResetCameraIcon />
        </button>
      </div>
      <div>
        <Link to="/">Back</Link>
      </div>
    </div>
  )
}

export default ToolBar;