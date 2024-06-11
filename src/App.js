import './App.css';
import React, { useState, useEffect } from 'react'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './bricks/Header';
import AlbumList from './bricks/AlbumList';
import AlbumPage from './bricks/AlbumPage';
import PhotoPage from './bricks/PhotoPage';

function App() {

    return (
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<AlbumList />} />
          <Route path="/album/:id" element={<AlbumPage />} />
          <Route path="/album/photo/:id" element={<PhotoPage />} />
       </Routes>
    </BrowserRouter>
   );
}

export default App;
