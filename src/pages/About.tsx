import {Link} from 'react-router-dom'
import React from 'react'

function About() {
  return (
    <div className="App">
      <div className="intro">This is Setup Editor</div>
      <Link to="/">Home</Link>
    </div>
  );
}

export default About;
