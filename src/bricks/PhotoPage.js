import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';

const PhotoPage = () => 
{
  const { id } = useParams();
  const [reload, setReload] = useState(false);

  const [photoState, setPhotoState] = useState({state: "pending"});
  const [showDelete, setShowDelete] = useState(false);
  
  const [showEdit, setShowEdit] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");

  const navigate = useNavigate();

  const handleShowDelete = () => setShowDelete(true);
  const handleCloseDelete = () => setShowDelete(false);

  const handleShowEdit = () => {
    setEditedTitle(photoState.data.title); // Set the initial value of the edited title to the current title
    setShowEdit(true);
  };
  const handleCloseEdit = () => setShowEdit(false);

  const goBackToAlbum = () => { navigate(`/album/${photoState.data.album}`); };
  
  const deletePhoto = () => 
  {
    fetch(`http://localhost:8000/photo/delete?id=${id}`, { method: "DELETE" })
      .then(async (response) => 
      {
        const responseJson = await response.json();
        if (response.status >= 400) {
          console.error("Error deleting photo:", responseJson);
        }
        else 
        {
          // Redirect to the album page after successful deletion
          navigate(`/album/${photoState.data.album}`);
        }
      });
  };
  
  const editTitle = () => 
  {
    fetch(`http://localhost:8000/photo/update`, 
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: editedTitle, id: id}),
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

  useEffect(() => 
  {
    fetch(`http://localhost:8000/photo/get?id=${id}`, { method: "GET" })
      .then(async (response) => 
      {
        const responseJson = await response.json();
        if (response.status >= 400) {
          setPhotoState({ state: "error", error: responseJson });
        } else {
          setPhotoState({ state: "success", data: responseJson });
        }
      });
  }, [reload, id]);

  if( photoState.state === "pending" ) { return <div>Loading...</div>; }  
  if( photoState.state === "error" ) { return <div>Error: {photoState.error}</div>; } 

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>Title: {photoState.data.title} <Button variant="primary" onClick={handleShowEdit}>Edit</Button></h2>
        </Col>
        <Col>
          <h2>Date: {photoState.data.date}</h2>
        </Col>
        <Col>
          <Button variant="primary" onClick={goBackToAlbum}>Back</Button> 
          <Button variant="danger" onClick={handleShowDelete}>Delete Photo</Button>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <img src={`http://localhost:8000${photoState.data.url}`} alt={photoState.data.title} style={{ width: '100%', height: 'auto' }} />
        </Col>
      </Row>

      <Modal show={showDelete} onHide={handleCloseDelete}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>Do you want to delete this photo?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseDelete}>Cancel</Button>
        <Button variant="danger" onClick={deletePhoto}>Delete</Button>
      </Modal.Footer>
    </Modal>

    <Modal show={showEdit} onHide={handleCloseEdit}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Title</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseEdit}>Cancel</Button>
        <Button variant="primary" onClick={editTitle}>Save</Button>
      </Modal.Footer>
    </Modal>

    </Container>
  );
};

export default PhotoPage;
