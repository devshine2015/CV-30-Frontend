import React from 'react';
import { Popover, Button, Tab, Tabs } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { availableColors } from '../../../../constants/headerBackgrounds';
import { updateCoverMutation, profileQuery, setFeedbackMessage } from '../../../../store/queries';
import ImageUploader from '../../../../components/imageUploader';
import { profilesFolder } from '../../../../constants/s3';

const ColorPickerHOC = compose(
    withRouter,
    graphql(profileQuery, {
        name: 'currentProfileQuery',
        options: (props) => ({
            variables: {
                language: props.match.params.lang
            },
            fetchPolicy: 'network-only'
        })
    }),
    graphql(updateCoverMutation, { name: 'updateCoverMutation' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('activeTab', 'setActiveTab', 'colors'),
    withState('imageUploadOpen', 'setImageUploadOpen', false),
    withHandlers({
        handleTabChange: ({ setActiveTab }) => (event, value) => {
            setActiveTab(value);
        },
        setBackgroundColor: ({ updateCoverMutation, setFeedbackMessage }) => async color => {
            try {
                await updateCoverMutation({
                    variables:
                    {
                        color: color ? color.style : 'none'
                    },
                    refetchQueries: [{
                        query: profileQuery,
                        fetchPolicy: 'network-only',
                        name: 'currentProfileQuery',
                        variables: {
                            language: 'en'
                        }
                    }]
                });
                await setFeedbackMessage({
                    variables: {
                        status: 'success',
                        message: 'Changes saved successfully.'
                    }
                });
            }
            catch (err) {
                console.log(err);
                await setFeedbackMessage({
                    variables: {
                        status: 'error',
                        message: err.message
                    }
                });
            }
        },

        handleError: ({ setFeedbackMessage }) => async error => {
            console.log(error);
            await setFeedbackMessage({
                variables: {
                    status: 'error',
                    message: error || error.message
                }
            });
        },
        handleSuccess: ({ setFeedbackMessage, updateCoverMutation, refetchBgImage, currentProfileQuery: { profile: { id } } }) => async ({ path, filename }) => {
            const coverPath = path ? path : `/${profilesFolder}/${id}/${filename}`;
            try {
                await updateCoverMutation({
                    variables:
                    {
                        path: coverPath
                    },
                    refetchQueries: [{
                        query: profileQuery,
                        fetchPolicy: 'network-only',
                        name: 'currentProfileQuery',
                        variables: {
                            language: 'en'
                        }
                    }]
                });
                await setFeedbackMessage({
                    variables: {
                        status: 'success',
                        message: 'Changes saved successfully.'
                    }
                });
            }
            catch (err) {
                console.log(err);
                await setFeedbackMessage({
                    variables: {
                        status: 'error',
                        message: err.message
                    }
                });
            }
            refetchBgImage();
        },
        openImageUpload: ({ setImageUploadOpen }) => () => setImageUploadOpen(true),
        closeImageUpload: ({ setImageUploadOpen }) => () => setImageUploadOpen(false),
    }),
    pure
);

const ColorPicker = props => {
    console.log(props);
    const { colorPickerAnchor, onClose,
        setBackgroundColor,
        activeTab, handleTabChange,
        openImageUpload, closeImageUpload, imageUploadOpen, handleError, handleSuccess,
        currentProfileQuery: { loading, profile }
    } = props;

    if (loading)
        return null;

    const { id: profileId } = profile;

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


                <Button size='small' className='picUploadButton' onClick={openImageUpload}>
                    Upload picture
                    </Button>

                <ImageUploader
                    type='profile_cover'
                    open={imageUploadOpen}
                    onClose={closeImageUpload}
                    onError={handleError}
                    onSuccess={handleSuccess}
                    id={profileId}
                />
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
                        <div
                            className='color none'
                            onClick={() => setBackgroundColor()}
                            key='colorPicker-none'
                        >None</div>
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