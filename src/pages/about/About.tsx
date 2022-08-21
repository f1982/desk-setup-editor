import { Link } from 'react-router-dom'
import React from 'react'
import './About.scss'

const AboutPage: React.FC = () => {
  return (
    <div className="page">
      <h1>About</h1>
      <div className="intro">This is the about page</div>
      <Link to="/">Back</Link>
    </div>
  );
}

export default AboutPage;
