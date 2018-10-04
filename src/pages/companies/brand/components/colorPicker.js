import React from 'react';
import { Popover, Button, Tab, Tabs } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl'

import { availableColors } from '../../../../constants/headerBackgrounds';
import { handleCompany, setFeedbackMessage } from '../../../../store/queries';
import { companyRefetch } from '../../../../store/refetch';
import ImageUploader from '../../../../components/imageUploader';
import { companiesFolder } from '../../../../constants/s3';

const ColorPickerHOC = compose(
    withRouter,
    graphql(handleCompany, { name: 'handleCompany' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('state', 'setState', {
        activeTab: 'colors',
        imageUploadOpen: false
    }),
    withHandlers({
        handleTabChange: ({ state, setState }) => (_, activeTab) => setState({
            ...state,
            activeTab
        }),
        setBackgroundColor: ({ handleCompany, match: { params: { lang: language, companyId } }, setFeedbackMessage }) => async color => {
            try {
                await handleCompany({
                    variables: {
                        language,
                        details: {
                            id: companyId,
                            coverBackground: color ? color.style : 'none'
                        }
                    },
                    refetchQueries: [
                        companyRefetch(companyId, language)
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
            handleCompany, refetchBgImage,
            match: { params: { companyId, lang: language } },
            setFeedbackMessage
        }) => async ({ path, filename }) => {
            const coverPath = path ? path : `/${companiesFolder}/${companyId}/${filename}`;

            try {
                await handleCompany({
                    variables: {
                        language,
                        details: {
                            id: companyId,
                            coverPath
                        }
                    },
                    refetchQueries: [
                        companyRefetch(companyId, language)
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
        state: { activeTab, imageUploadOpen }, handleTabChange,
        openImageUpload, closeImageUpload, handleError, handleSuccess,
        match: { params: { companyId } }
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
                    type='company_cover'
                    open={imageUploadOpen}
                    onClose={closeImageUpload}
                    onError={handleError}
                    onSuccess={handleSuccess}
                    id={companyId}
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
                        <FormattedMessage id="company.brand.none" defaultMessage="None" description="None">
                            {(text) => (
                                <div
                                    className='color none'
                                    onClick={() => setBackgroundColor()}
                                    key='colorPicker-none'
                                >{text}</div>
                            )}
                        </FormattedMessage>
                        
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
