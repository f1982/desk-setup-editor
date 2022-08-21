import { Link } from 'react-router-dom'
import React from 'react'
import './Home.scss';

const Intro: React.FC = () => {
  return (
    <div className="page">
      <div className="intro">
        Create a design tool help user to easily design their WFH desktop setups. Ultimately, user will have a very easy to use UI experience, can build their beautiful setups and share their works to others.
      </div>
      <div>
        <Link to="/editor">
          <h1>Start</h1>
        </Link>
      </div>
      <div className='links'>
        <Link to="/about">About</Link>
        <Link to="/help">Help</Link>
      </div>
    </div>
  );
}

export default Intro;
