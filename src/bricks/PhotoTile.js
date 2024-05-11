import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import global from '../global';    

const PhotoTile = ({ photo }) => 
{
    const iconUrl= global.getServerUrl()+photo.iconUrl;

    return (
        <Card bg="light" className="mb-4 text-left">
            <Card.Body className="text-left">
                <Card.Title className="text-left">
                    <Link to={{pathname: `/album/photo/${photo.id}`, state: { photo: photo }}}> {photo.title}</Link>
                </Card.Title>
                <Card.Title className="text-left">
                    <Link to={{pathname: `/album/photo/${photo.id}`, state: { photo: photo }}}><img src={iconUrl} alt={photo.filename} /></Link>
                </Card.Title>
                <Card.Text className="text-left">
                    <Link to={{pathname: `/album/photo/${photo.id}`, state: { photo: photo }}}>Taken on {photo.date}</Link>
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

PhotoTile.propTypes = {
    photo: PropTypes.object.isRequired
};

export default PhotoTile;
