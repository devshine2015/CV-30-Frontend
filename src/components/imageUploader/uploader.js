import React from 'react';
import DropNCrop from '@synapsestudios/react-drop-n-crop';
import Dropzone from 'react-dropzone';
import '@synapsestudios/react-drop-n-crop/lib/react-drop-n-crop.min.css';
import { compose, withState, withHandlers } from 'recompose';
// import { upload } from 'superagent'
// import axios from 'axios' 
import { Button } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import uuid from 'uuidv4';
// Import Mutation

////////////////////
const uploadFile = async (image, signedUrl) => {
    console.log("#################", image, signedUrl)
    let block = image.result.split(";");
    let contentType = block[0].split(":")[1];

    let imageData = image.result.split(',')[1],
        binary = atob(imageData),
        array = [];

    for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    console.log("))))))))", contentType)
    var typedArray = new Uint8Array(array);

    try {
        const result = await fetch(signedUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': contentType,
            },
            body: typedArray
        });
        console.log(result)
        return ({ result, error: null });
    }
    catch (error) {
        console.log(error);
        return ({ result: null, error });
    }
};
const uploadFile_ = async (file, signedUrl) => {
    console.log("*****************************", file, signedUrl)
    
    var formData = new FormData();
    formData.append('file', file);
    try {
        const result = await fetch(signedUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'multi-part/form',
            },
            formData
        });
        console.log(result)
        
        return ({ result, error: null });
    }
    catch (error) {
        console.log(error);
        return ({ result: null, error });
    }
}
const ImageUploadHOC = compose(
    
    withState('image', 'setImage', {
        result: null,
        filename: null,
        filetype: null,
        src: null,
        error: null,
    }),
    withState('file', 'setFile',{
        filename: null,
        filetype: null,
        id: null,
    }),
    withState('originFile', 'setOriginFile',{
        name: null,
        type: null,
    }) ,
    withHandlers({
        onChange: ({ setImage }) => image =>
            setImage({ ...image, filename: image.filename ? `${uuid()}.${image.filetype.replace('image/', '')}` : null }),
        
        handleUploadFile: ({ image, file, originFile , id, onSuccess, onError, onClose, type }) => async () => {
            const params = {
                fileName: type === 'document'? file.filename : image.filename,
                contentType: type === 'document'? file.filetype : image.filetype,
                id : type === 'document'? file.id : id,
                type
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
                let error_ = null
                if (type === "document") {
                    let { error } = await uploadFile_(originFile, responseJson.signedUrl)
                    error_ = error
                    
                } else {
                    let { error } = await uploadFile(image, responseJson.signedUrl);
                    error_ = error
                }
                

                if (error_)
                    onError(error_);
                else {
                    if (type === 'document') {
                        onSuccess(file)
                    } else {
                        onSuccess(image);
                    }
                    onClose();
                }
            } catch (error) {
                onError(error);
                return false;
            }
        },
        onDrop:({setFile, setOriginFile}) => (acceptedFiles, rejectedFiles) => {
            let file = acceptedFiles[0]
            
            let id = uuid()
            setFile({...file, filename: file.name? `${id}.${file.type.replace('application/', '')}` : null, filetype: file.type, id:id })
            setOriginFile({...file,  name: file.name, type: file.type})
        }
    })
);

const ImageUpload = ({ image, onChange, handleUploadFile, type, onDrop, file }) => {
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
            {
                type === 'document'? 
                <Dropzone onDrop={(files) => onDrop(files)}>
                    <div>Try dropping some files here, or click to select files to upload.</div>
                </Dropzone>
                :
                <DropNCrop
                    onChange={onChange}
                    value={image}
                    maxFileSize={maxFileSize}
                    allowedFileTypes={allowedFileTypes}
                    instructions={instructions}
                />
            }
            <Button onClick={handleUploadFile} className='uploadBtn' style={type === 'document'? { opacity: !file || !file.filename ? 0.5 : 1 }  : { opacity: !image || !image.filename ? 0.5 : 1 }} disabled={type !== 'document'? !image || !image.filename : !file || !file.filename}>Upload</Button>
        </div>
    )
};

export default ImageUploadHOC(ImageUpload);