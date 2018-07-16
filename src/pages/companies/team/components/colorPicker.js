import React from 'react';
import { Popover, Button, Tab, Tabs } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import S3Uploader from 'react-s3-uploader';

import { availableColors } from '../../../../constants/headerBackgrounds';
import { handleTeam, queryTeam } from '../../../../store/queries';
import { graphql } from 'react-apollo';

const ColorPickerHOC = compose(
    graphql(handleTeam, { name: 'handleTeam' }),
    withState('activeTab', 'setActiveTab', 'colors'),
    withState('isUploading', 'setIsUploading', false),
    withState('uploadProgress', 'setUploadProgress', 0),
    withState('uploadError', 'setUploadError', null),
    withHandlers({
        handleTabChange: ({ setActiveTab }) => (event, value) => {
            setActiveTab(value);
        },
        setBackgroundColor: ({ handleTeam, match: { params: { lang, teamId } }, company }) => async color => {
            try {
                await handleTeam({
                    variables:
                    {
                        teamDetails: {
                            id: teamId,
                            hasProfileCover: false,
                            coverBackground: color.style,
                            companyId: company.id
                        }
                    },
                    refetchQueries: [{
                        query: queryTeam,
                        fetchPolicy: 'network-only',
                        name: 'queryTeam',
                        variables: {
                            language: lang,
                            id: teamId
                        }
                    }]
                });
            }
            catch (err) {
                console.log(err);
            }
        },
        getSignedUrl: ({ match: { params: { teamId } } }) => async (file, callback) => {
            const params = {
                fileName: `cover.${file.type.replace('image/', '')}`,
                contentType: file.type,
                id: teamId,
                type: 'team_cover'
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
        onFinish: ({ setIsUploading, handleTeam, refetchBgImage, match: { params: { teamId, lang } }, company }) => async () => {
            try {
                await handleTeam({
                    variables:
                    {
                        teamDetails: {
                            id: teamId,
                            hasProfileCover: true,
                            coverBackground: '',
                            companyId: company.id
                        }
                    },
                    refetchQueries: [{
                        query: queryTeam,
                        fetchPolicy: 'network-only',
                        name: 'queryTeam',
                        variables: {
                            language: lang,
                            id: teamId
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
                        accept=".png"
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