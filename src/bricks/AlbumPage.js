import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import PhotoTile from './PhotoTile';

const AlbumPage = () => 
{
  const { id } = useParams();

  const [album, setAlbum] = useState({state: "pending"});
  const [reload, setReload] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [newTitle, setNewTitle] = useState();
  const [photoTitle, setPhotoTitle] = useState("");

  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);
  const handleFileChange = (e) => { setSelectedFile(e.target.files[0]); };

  const handleShowEdit = () => { setNewTitle(album.data.title); setShowEdit(true)};
  const handleCloseEdit = () => setShowEdit(false);
  const handleTitleChange = (e) => setNewTitle(e.target.value);

  const handleShowUpload = () => setShowUpload(true);
  const handleCloseUpload = () => setShowUpload(false); 

  const handleEditAlbum = () => 
  {
    console.log('Editing album title:', newTitle);  
    
    const formData = new URLSearchParams();
    formData.append('id', id);
    formData.append('title', newTitle);
  
    fetch(`http://localhost:8000/album/update`, { 
      method: 'POST', 
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString(),
    })
    .then((response) => response.json())
    .then((data) => {
      setReload(!reload); 
    })
    .catch((error) => {
      console.error('Error:', error);
    });

    handleCloseEdit();
  };
  
  const uploadPhoto = () => 
  {
    const formData = new FormData();
    formData.append('album', id);
    formData.append('title', photoTitle);
    formData.append('file', selectedFile);

    fetch(`http://localhost:8000/album/upload`, {
      method: 'POST',
      body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
      setReload(!reload);
    })
    .catch((error) => {
      console.error('Error:', error);
    });

    handleCloseUpload();
  };

  const deleteAlbum = () => 
  {
    fetch(`http://localhost:8000/album/delete?id=${id}`, { method: "DELETE" })
      .then(async (response) => 
      {
        if (response.status >= 400) 
        {
          console.error('Error:', await response.json());
        } 
        else 
        {
          // Redirect to the album home page after successful deletion
          window.location.href = '/';
        }
      });
  };

  useEffect(() => 
  {
    fetch(`http://localhost:8000/album/get?id=${id}`, { method: "GET" })
      .then(async (response) => 
      {
        const responseJson = await response.json();
        if (response.status >= 400) {
          setAlbum({ state: "error", error: responseJson });
        } else {
          setAlbum({ state: "success", data: responseJson });
        }
      });
  }, [reload, id]);

  if( album.state === "pending" ) { return <div>Loading...</div>; }  
  if( album.state === "error" ) { return <div>Error: {album.error}</div>; } 

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1>Album: {album.data.title} <Button variant="secondary" onClick={handleShowEdit}>Edit</Button></h1>
          <p>Created on {album.data.date}</p>
          <Button variant="danger" onClick={handleShowDelete}>Delete Album</Button>
        </Col>
      </Row>

      <Modal show={showDelete} onHide={handleCloseDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this album?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteAlbum}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Album Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control type="text" placeholder="Enter new album title" value={newTitle} onChange={handleTitleChange} autoFocus />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditAlbum}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpload} onHide={handleCloseUpload}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row}>
              <Form.Label column sm="4">File: </Form.Label>
              <Col sm="10">
                <Form.Control type="file" onChange={handleFileChange} />
              </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">Title: </Form.Label>
            <Col sm="10">
              <Form.Control type="text" value={photoTitle} onChange={(e) => setPhotoTitle(e.target.value)} />
            </Col>
          </Form.Group>          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUpload}>
            Cancel
          </Button>
          <Button variant="primary" onClick={uploadPhoto}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>

      <Row>
        {album.data.photos.map((photo) => (
          <Col sm={12} md={6} lg={4} key={photo.id}>
            <PhotoTile photo={photo} album={id} />
          </Col>
        ))}
      </Row>
      <Row>
        <Col>
          <Button onClick={handleShowUpload}>Upload New Photo...</Button>        
        </Col>
      </Row>

    </Container>
  );
};

export default AlbumPage;
