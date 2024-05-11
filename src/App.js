import './App.css';
import React, { useState, useEffect } from 'react'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './bricks/Header';
import AlbumList from './bricks/AlbumList';
import AlbumPage from './bricks/AlbumPage';
import PhotoPage from './bricks/PhotoPage';

function App() {

    const [albumList, setAlbumList] = useState({
      state: "pending",
    });
  
    useEffect(() => {
      fetch(`http://localhost:8000/album/list`, {
        method: "GET",
      }).then(async (response) => {
        const responseJson = await response.json();
        if (response.status >= 400) {
          setAlbumList({ state: "error", error: responseJson });
        } else {
          setAlbumList({ state: "success", data: responseJson });
        }
      });
    }, []);
  
    if( albumList.state === "pending" ) { return <div>Loading...</div>; }  
    if( albumList.state === "error" ) { return <div>Error: {albumList.error}</div>; } 

    return (
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<AlbumList albumList={albumList.data}/>} />
          <Route path="/album/:id" element={<AlbumPage />} />
          <Route path="/album/photo/:id" element={<PhotoPage />} />
       </Routes>
    </BrowserRouter>
   );
}

export default App;
