import React from 'react';
import { Popover, Button, Tab, Tabs } from '@material-ui/core';
import { compose, withState, withHandlers, pure, lifecycle } from 'recompose';
import S3Uploader from 'react-s3-uploader';

import { availableColors } from '../../../../constants/headerBackgrounds';
import { updateCoverMutation, currentUserQuery } from '../../../../store/queries';
import { graphql } from 'react-apollo';

const ColorPickerHOC = compose(
    graphql(updateCoverMutation, { name: 'updateCoverMutation' }),
    withState('activeTab', 'setActiveTab', 'colors'),
    withState('isUploading', 'setIsUploading', false),
    withState('uploadProgress', 'setUploadProgress', 0),
    withState('uploadError', 'setUploadError', null),
    withHandlers({
        handleTabChange: ({ setActiveTab }) => (event, value) => {
            setActiveTab(value);
        },
        setBackgroundColor: ({ updateCoverMutation }) => async color => {
            try {
                await updateCoverMutation({
                    variables:
                    {
                        status: false,
                        color: color.style
                    },
                    refetchQueries: [{
                        query: currentUserQuery,
                        fetchPolicy: 'network-only',
                        name: 'currentUser',
                        variables: {
                            language: 'en'
                        }
                    }]
                });
            }
            catch (err) {
                console.log(err);
            }
        },
        getSignedUrl: ({ profile }) => async (file, callback) => {
            let getExtension = file.name.slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2);
            let fName = ['cover', getExtension].join('.');

            const params = {
                fileName: fName,
                contentType: file.type,
                id: profile.id,
                type: 'profile_cover'
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
                callback(responseJson);
            } catch (error) {
                console.error(error);
                callback(error)
            }
        },
        onUploadStart: ({ setIsUploading }) => (file, next) => {
            setIsUploading(true);
            next(file);
        },
        onProgress: ({ setUploadProgress }) => (percent) => {
            setUploadProgress(percent);
        },
        onError: ({ setUploadError }) => error => {
            setUploadError(error);
            console.log(error);
        },
        onFinish: ({ setIsUploading, updateCoverMutation, refetchBgImage }) => async () => {
            try {
                await updateCoverMutation({
                    variables:
                    {
                        status: true
                    },
                    refetchQueries: [{
                        query: currentUserQuery,
                        fetchPolicy: 'network-only',
                        name: 'currentUser',
                        variables: {
                            language: 'en'
                        }
                    }]
                });
            }
            catch (err) {
                console.log(err);
            }
            setIsUploading(false);
            refetchBgImage();
        }
    }),
    pure
);

const ColorPicker = (props) => {
    const { colorPickerAnchor, onClose,
        setBackgroundColor,
        activeTab, handleTabChange,
        getSignedUrl, onUploadStart, onProgress, onError, onFinish,
    } = props;
    return (
        <Popover
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            open={Boolean(colorPickerAnchor)}
            anchorEl={colorPickerAnchor}
            onClose={onClose}
            classes={{
                paper: 'colorPickerPaper'
            }}
        >
            <div className='popupHeader'>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                >
                    <Tab label="Colors" value='colors' />
                    <Tab label="Patterns" value='patterns' />
                </Tabs>

                <label htmlFor="uploadCoverPhoto">
                    <S3Uploader
                        id="uploadCoverPhoto"
                        name="uploadCoverPhoto"
                        className='hiddenInput'
                        getSignedUrl={getSignedUrl}
                        accept="image/*"
                        preprocess={onUploadStart}
                        onProgress={onProgress}
                        onError={onError}
                        onFinish={onFinish}
                        uploadRequestHeaders={{
                            'x-amz-acl': 'public-read',
                        }}
                    />
                    <Button component='span' size='small' className='picUploadButton'>
                        Upload picture
                    </Button>
                </label>


            </div>
            <div className='popupBody'>
                {activeTab === 'colors' &&
                    <div className='pickerContainer colors'>
                        {
                            availableColors.map((color, index) =>
                                <div
                                    className='color'
                                    onClick={() => setBackgroundColor(color)}
                                    style={{ background: color.style }}
                                    key={`colorPicker-${index}`}
                                />)
                        }
                    </div>
                }
                {
                    activeTab === 'patterns' &&
                    <div className='pickerContainer patterns'>
                        <pre>Patterns</pre>
                    </div>
                }
            </div>
        </Popover>
    );
}

export default ColorPickerHOC(ColorPicker);