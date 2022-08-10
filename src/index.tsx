import React from 'react'
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter, HashRouter, Route, Routes
} from "react-router-dom";
import reportWebVitals from './reportWebVitals';

import About from './pages/About';
import Editor from './pages/Editor';
import Home from './pages/Home';

import './global.scss';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <HashRouter basename="/">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/editor" element={<Editor />} />
      <Route path="/about" element={<About />} />
    </Routes>
  </HashRouter>

  // <React.StrictMode>
  // <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
