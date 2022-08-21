import ReactDOM from 'react-dom/client';
import {
  HashRouter, Route, Routes
} from "react-router-dom";
import reportWebVitals from './reportWebVitals';

import AboutPage from './pages/about/About';
import Editor from './pages/editor/Editor';
import HelpPage from './pages/help/Help';
import Home from './pages/home/Home';

import './global.scss';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <HashRouter basename="/">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/editor" element={<Editor />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/help" element={<HelpPage />} />
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
