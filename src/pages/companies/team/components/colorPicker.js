import React from 'react';
import { Popover, Button, Tab, Tabs } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';

import { availableColors } from '../../../../constants/headerBackgrounds';
import { handleTeam, setFeedbackMessage } from '../../../../store/queries';
import { teamRefetch } from '../../../../store/refetch';
import { teamsFolder } from '../../../../constants/s3';
import ImageUploader from '../../../../components/imageUploader';

const ColorPickerHOC = compose(
    graphql(handleTeam, { name: 'handleTeam' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('activeTab', 'setActiveTab', 'colors'),
    withState('imageUploadOpen', 'setImageUploadOpen', false),
    withHandlers({
        handleTabChange: ({ setActiveTab }) => (event, value) => {
            setActiveTab(value);
        },
        setBackgroundColor: ({ setFeedbackMessage, handleTeam, match: { params: { lang, teamId } }, company }) => async color => {
            try {
                await handleTeam({
                    variables:
                    {
                        teamDetails: {
                            id: teamId,
                            coverBackground: color ? color.style : 'none',
                            companyId: company.id
                        }
                    },
                    refetchQueries: [
                        teamRefetch(teamId, lang)
                    ]
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
        openImageUpload: ({ setImageUploadOpen }) => () => setImageUploadOpen(true),
        closeImageUpload: ({ setImageUploadOpen }) => () => setImageUploadOpen(false),
        handleError: ({ setFeedbackMessage }) => async error => {
            console.log(error);
            await setFeedbackMessage({
                variables: {
                    status: 'error',
                    message: error || error.message
                }
            });
        },
        handleSuccess: ({
            setFeedbackMessage, handleTeam, refetchBgImage,
            match: { params: { teamId, lang } }, company,
        }) => async ({ path, filename }) => {
            const coverPath = path ? path : `/${teamsFolder}/${teamId}/${filename}`;
            try {
                await handleTeam({
                    variables:
                    {
                        teamDetails: {
                            id: teamId,
                            coverPath,
                            companyId: company.id
                        }
                    },
                    refetchQueries: [
                        teamRefetch(teamId, lang)
                    ]
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
        }
    }),
    pure
);

const ColorPicker = (props) => {
    const { colorPickerAnchor, onClose,
        setBackgroundColor,
        activeTab, handleTabChange,
        openImageUpload, closeImageUpload, imageUploadOpen, handleError, handleSuccess,
        match: { params: { teamId } }
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


                <Button size='small' className='picUploadButton' onClick={openImageUpload}>
                    Upload picture
                    </Button>
                <ImageUploader
                    type='team_cover'
                    open={imageUploadOpen}
                    onClose={closeImageUpload}
                    onError={handleError}
                    onSuccess={handleSuccess}
                    id={teamId}
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