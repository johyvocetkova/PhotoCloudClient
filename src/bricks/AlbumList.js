import React, { useState, useEffect }  from 'react';
import AlbumTile from './AlbumTile';
import PropTypes from 'prop-types';
import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { getServerUrl } from '../global';

function now() 
{
  return new Date().toISOString().substring(0, 19);
}

const AlbumList = () => 
{
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [reload, setReload] = useState(false);
  const [albumList, setAlbumList] = useState({ state: "pending"});

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleTitleChange = (event) => setTitle(event.target.value);

  const createAlbum = () => {

    if (title.trim() === '') {
      alert('Title cannot be empty');
      return;
    }

    const newAlbum = {
      title: title,
      date: now(),
    };

    fetch( getServerUrl()+"/album/create", 
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAlbum),
    })
    .then((response) => {           
      setReload(!reload);
    })
    .then((data) => {
      handleClose();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  useEffect(() => 
  {
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
  }, [reload]);

  if( albumList.state === "pending" ) { return <div>Loading...</div>; }  
  if( albumList.state === "error" ) { return <div>Error: {albumList.error}</div>; } 

  return (
    <Container>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Album</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Album Title</Form.Label>
              <Form.Control type="text" placeholder="Enter album title" value={title} onChange={handleTitleChange} autoFocus />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={createAlbum}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>

      <Row>
        {albumList.data.map((album) => (
          <Col sm={12} md={6} lg={4} key={album.id}>
            <AlbumTile album={album} />
          </Col>
        ))}
      </Row>

      <Button variant="primary" onClick={handleShow}>
        Create New Album
      </Button>

    </Container>
  );
};

AlbumList.propTypes = {
  albumList: PropTypes.array.isRequired
};

export default AlbumList;
