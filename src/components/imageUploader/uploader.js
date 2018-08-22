import React from 'react';
import DropNCrop from '@synapsestudios/react-drop-n-crop';
import '@synapsestudios/react-drop-n-crop/lib/react-drop-n-crop.min.css';
import { compose, withState, withHandlers } from 'recompose';
import { Button } from '@material-ui/core';
import uuid from 'uuidv4';

const uploadFile = async (image, signedUrl) => {
    let block = image.result.split(";");
    let contentType = block[0].split(":")[1];

    let imageData = image.result.split(',')[1],
        binary = atob(imageData),
        array = [];

    for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }

    var typedArray = new Uint8Array(array);

    try {
        const result = await fetch(signedUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': contentType,
            },
            body: typedArray
        });
        return ({ result, error: null });
    }
    catch (error) {
        console.log(error);
        return ({ result: null, error });
    }
};

const ImageUploadHOC = compose(
    withState('image', 'setImage', {
        result: null,
        filename: null,
        filetype: null,
        src: null,
        error: null,
    }),
    withHandlers({
        onChange: ({ setImage }) => value => {
            setImage(value);
            console.log(value);
        },

        handleUploadFile: ({ image, articleId, setImage, onSuccess, onError, onClose }) => async () => {
            const params = {
                fileName: image.filename,
                contentType: image.filetype,
                id: articleId || uuid(),
                type: 'article'
            };

            try {
                let response = await fetch('https://k73nyttsel.execute-api.eu-west-1.amazonaws.com/production/getSignedURL', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(params)
                });
                let responseJson = await response.json();

                let { result, error } = await uploadFile(image, responseJson.signedUrl);
                console.log(result);
                if (error)
                    onError(error);
                else {
                    onSuccess(image);
                    onClose();
                }
            } catch (error) {
                onError(error);
                return false;
            }
        }
    })
);

const ImageUpload = ({ image, onChange, handleUploadFile }) => {
    return (
        <div className='imageUpload'>
            <DropNCrop onChange={onChange} value={image} />
            <Button onClick={handleUploadFile} className='uploadBtn'>Upload</Button>
        </div>
    )
};

export default ImageUploadHOC(ImageUpload);