import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const AlbumTile = ( { album} ) => 
{
    return (
        <Card bg="light" className="mb-4 text-left">
            <Card.Body className="text-left">
                <Card.Title className="text-left">
                    <Link to={`/album/${album.id}`}>{album.title}</Link>
                </Card.Title>
                <Card.Text className="text-left">From: {album.date}</Card.Text>
            </Card.Body>
        </Card>
    )
}

AlbumTile.propTypes = 
{
    album: PropTypes.object.isRequired
};

export default AlbumTile;