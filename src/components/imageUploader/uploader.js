import React from 'react';
import DropNCrop from '@synapsestudios/react-drop-n-crop';
import '@synapsestudios/react-drop-n-crop/lib/react-drop-n-crop.min.css';
import { compose, withState, withHandlers } from 'recompose';
import { Button } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';


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

        handleUploadFile: ({ image, id, onSuccess, onError, onClose, type }) => async () => {
            const params = {
                fileName: image.filename,
                contentType: image.filetype,
                id,
                type
            };

            console.log(JSON.stringify(params, null, 2));

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

const ImageUpload = ({ image, onChange, handleUploadFile, type }) => {
    let maxFileSize = (type === 'company_logo') || (type === 'profile_avatar') ? 204800 : 3145728;
    let allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    let instructions = (
        <div className="dropzone-instructions">
            <FormattedMessage id="uploader.dragNDrop" defaultMessage="Drag-n-drop a file or click to add an image">
                {(text) => (
                    <div className="dropzone-instructions--main">
                        {text}
                    </div>
                )}
            </FormattedMessage>
            <FormattedMessage id="uploader.acceptedFiles" defaultMessage="Accepted file types: ">
                {(text) => (
                    <div className="dropzone-instructions--sub">
                        {text}
                        {allowedFileTypes
                            .map(mimeType => `.${mimeType.split('/')[1]}`)
                            .join(', ')}
                    </div>
                )}
            </FormattedMessage>
            <FormattedMessage id="uploader.maxFileSize" defaultMessage="Max file size:">
                {(text) => (
                    <div className="dropzone-instructions--sub">
                        {text} {(type === 'company_logo') || (type === 'profile_avatar') ? '200kB' : '3MB'}
                    </div>
                )}
            </FormattedMessage>
            <FormattedMessage id="uploader.imageSizes" defaultMessage="Recommended image size:">
                {(text) => (
                    <div className="dropzone-instructions--sub">
                        {text} {(type === 'company_logo') || (type === 'profile_avatar') ? '200x200' : '1920x1080'}
                    </div>
                )}
            </FormattedMessage>
        </div>
    );
    return (
        <div className='imageUpload'>
            <DropNCrop
                onChange={onChange}
                value={image}
                maxFileSize={maxFileSize}
                allowedFileTypes={allowedFileTypes}
                instructions={instructions}
            />
            <Button onClick={handleUploadFile} className='uploadBtn' disabled={!image || !image.filename}>Upload</Button>
        </div>
    )
};

export default ImageUploadHOC(ImageUpload);