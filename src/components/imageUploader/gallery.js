import React from 'react';
import { GridList, GridListTile } from '@material-ui/core';
import { compose, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { s3BucketURL } from '../../constants/s3';
import Loader from '../Loader';

const IMAGES_QUERY = gql`
    query images {
        images {
            id
            path    
            sourceId
            sourceType
        }
    }
`;

const GalleryHOC = compose(
    graphql(IMAGES_QUERY, {
        name: 'imagesQuery',
        options: () => ({
            fetchPolicy: 'network-only',
        }),
    }),
    withHandlers({
        handleClick: ({ onSuccess, onClose }) => image => {
            onSuccess(image);
            onClose();
        }
    })
)

const Gallery = ({ imagesQuery: { loading, images }, handleClick }) => {
    if (loading)
        return <Loader />

    return (
        <div className='gallery'>
            <GridList cellHeight={180} className='gridList'>
                {images && images.map(image => (
                    <GridListTile key={image.id}>
                        <img src={`${s3BucketURL}${image.path}`} alt={image.id} className='gridImage' onClick={() => handleClick(image)} />
                    </GridListTile>
                ))}
            </GridList>
        </div>
    )
};

export default GalleryHOC(Gallery);