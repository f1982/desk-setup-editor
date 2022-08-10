import ReactDOM from 'react-dom/client';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import React from 'react'
import {
  BrowserRouter, Route, Routes
} from "react-router-dom";

import About from './pages/About';
import Editor from './pages/Editor';
import Intro from './pages/Intro';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Intro />}>
        
        {/* <Route path="/">
          <Intro />
        </Route>
        <Route path="/about">
          <About />
        </Route> */}
      </Route>
      <Route path="/editor" element={<Editor />} />
      <Route path="/about" element={<About />} />
    </Routes>
  </BrowserRouter>

  // <React.StrictMode>
  // <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
