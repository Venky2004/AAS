import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import CropList from './components/CropList';
import PostCrop from './components/PostCrop';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/crops" element={<CropList />} />
      <Route path="/post-crop" element={<PostCrop />} />
    </Routes>
  </Router>
);

export default App;
