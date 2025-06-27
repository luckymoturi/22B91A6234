import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import URLShortenerApp from './URLShortenerApp';
import RedirectHandler from './RedirectHandler';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<URLShortenerApp />} />
        <Route path="/:shortcode" element={<RedirectHandler />} />
      </Routes>
    </Router>
  );
}

export default App;
