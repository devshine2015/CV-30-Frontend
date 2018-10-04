import React from 'react';
import { Popover, Button, Tab, Tabs } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl'
import { availableColors } from '../../../../constants/headerBackgrounds';
import { handleTeam, setFeedbackMessage } from '../../../../store/queries';
import { teamRefetch } from '../../../../store/refetch';
import { teamsFolder } from '../../../../constants/s3';
import ImageUploader from '../../../../components/imageUploader';

const ColorPickerHOC = compose(
    graphql(handleTeam, { name: 'handleTeam' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('state', 'setState', {
        activeTab: 'colors',
        imageUploadOpen: false
    }),
    withHandlers({
        handleTabChange: ({ state, setState }) => (_, activeTab) => setState({ ...state, activeTab }),
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
        openImageUpload: ({ state, setState }) => () => setState({ ...state, imageUploadOpen: true }),
        closeImageUpload: ({ state, setState }) => () => setState({ ...state, imageUploadOpen: false }),
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
    const {
        state: {
            activeTab,
            imageUploadOpen
        },
        colorPickerAnchor, onClose,
        setBackgroundColor,
        handleTabChange,
        openImageUpload, closeImageUpload, handleError, handleSuccess,
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
                <FormattedMessage id="company.brand.patterns" defaultMessage="Colors\nPatterns" description="Colors Patterns">
                    {(text) => (
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                        >
                            <Tab label={text.split("\n")[0]} value='colors' />
                            <Tab label={text.split("\n")[1]} value='patterns' />
                        </Tabs>
                    )}
                </FormattedMessage>
                <FormattedMessage id="company.brand.picUpload" defaultMessage="Upload picture" description="Upload picture">
                    {(text) => (
                        <Button size='small' className='picUploadButton' onClick={openImageUpload}>
                            {text}
                        </Button>
                    )}
                </FormattedMessage>
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
                        <FormattedMessage id="company.brand.patterns" defaultMessage="Patterns" description="Patterns">
                            {(text) => (
                                <pre>{text}</pre>
                            )}
                        </FormattedMessage>
                    </div>
                }
            </div>
        </Popover>
    );
}

export default ColorPickerHOC(ColorPicker);