import { Link } from 'react-router-dom'
import React from 'react'
import './Help.scss';

const HelpPage: React.FC = () => {
  return (
    <div className="page">
      <h1>Help</h1>
      <div className="intro">This is the help page</div>
      <Link to="/">Back</Link>
    </div>
  );
}

export default HelpPage;
