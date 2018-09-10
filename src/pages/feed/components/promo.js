import React from 'react';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { Popover, IconButton, Icon, TextField, Button } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import uuid from 'uuidv4';

import { getCurrentUser, getAds, handleAd, setFeedbackMessage } from '../../../store/queries';
import { adsRefetch } from '../../../store/refetch';
import Loader from '../../../components/Loader';
import ImageUploader from '../../../components/imageUploader';
import { s3BucketURL, adsFolder } from '../../../constants/s3';

const PromoEditHOC = compose(
    withRouter,
    graphql(getCurrentUser, {
        name: 'currentUser'
    }),
    graphql(getAds, {
        name: 'getAds',
        options: ({ match: { params: { lang: language } } }) => ({
            fetchPolicy: 'network-only',
            variables: {
                language
            }
        })
    }),
    graphql(handleAd, { name: 'handleAd' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('state', 'setState', ({ getAds: { ads } }) => ({
        formData: {
            id: (ads && ads[0] && ads[0].id) || uuid(),
            url: (ads && ads[0] && ads[0].url) || null,
            image: (ads && ads[0] && ads[0].image) || null
        },
        promoAnchor: null,
        imageUploadOpen: false
    })),
    withHandlers({
        handleFormChange: ({ setFormData }) => event => {
            const target = event.currentTarget;
            const name = target.name;
            const value = target.value;
            if (!name) {
                throw Error('Field must have a name attribute!');
            }
            setFormData(state => ({ ...state, [name]: value }));
        },
        openPromoEditor: ({ state, setState }) => ev => setState({ ...state, promoAnchor: ev.target }),
        closePromoEditor: ({ state, setState }) => () => setState({ ...state, promoAnchor: null }),
        openImageUpload: ({ state, setState }) => () => setState({ ...state, imageUploadOpen: true }),
        closeImageUpload: ({ state, setState }) => () => setState({ ...state, imageUploadOpen: false }),
        handleError: ({ setFeedbackMessage }) => async error => {
            await setFeedbackMessage({
                variables: {
                    status: 'error',
                    message: JSON.stringify(error, null, 2)
                }
            });
        },
        handleSuccess: ({ state, setState }) => async ({ path, filename }) => {
            const imgPath = path ? path : `/${adsFolder}/${state.formData.id}/${filename}`;
            const image = {
                id: uuid(),
                sourceType: 'ad',
                path: imgPath
            };
            setState({
                ...state,
                formData: {
                    ...state.formData,
                    image
                }
            });
        },
        removeImage: ({ state, setState }) => () => setState({
            ...state,
            formData: {
                ...state.formData,
                image: null
            }
        }),
        saveData: ({ state, setState, handleAd, setFeedbackMessage, match: { params: { lang: language } } }) => async () => {
            try {
                await handleAd({
                    variables: {
                        language,
                        details: state.formData
                    },
                    refetchQueries: [
                        adsRefetch(language)
                    ]
                });
                await setFeedbackMessage({
                    variables: {
                        status: 'success',
                        message: 'Changes saved successfully.'
                    }
                });
                setState({
                    ...state,
                    promoAnchor: null
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
        }
    }),
    pure
);

const Promo = ({
    state: { formData: { id, url, image }, promoAnchor, imageUploadOpen },
    openPromoEditor, closePromoEditor, handleFormChange, removeImage,
    openImageUpload, closeImageUpload, handleError, handleSuccess,
    saveData, getAds: { loading: adsLoading, ads },
    currentUser: { loading: userLoading, auth: { currentUser } }
}) => {
    if (adsLoading || userLoading)
        return <Loader />

    const ad = (ads && ads[0]) ? ads[0] : null;

    return (
        <React.Fragment>
            <section className='promo'>
                {ad ?
                    <a href={ad.url} className='promoLink' target='_blank'>
                        <img src={`${s3BucketURL}${ad.image.path}`} className='promoImg' alt='' />
                    </a>
                    : <span className='noPromo'>Promo</span>
                }
                {(currentUser && currentUser.god) &&
                    <IconButton className='floatingEditBtn' onClick={openPromoEditor}>
                        <Icon>edit</Icon>
                    </IconButton>
                }
            </section>

            <Popover
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(promoAnchor)}
                anchorEl={promoAnchor}
                onClose={closePromoEditor}
                classes={{
                    paper: 'promoEditPaper'
                }}
            >
                <div className='popupBody'>
                    {image &&
                        <div className='media'>
                            <img src={`${s3BucketURL}${image.path}`} alt='ad' />
                            <IconButton className='deleteBtn' onClick={removeImage}>
                                <Icon>close</Icon>
                            </IconButton>
                        </div>
                    }
                    <TextField
                        name="url"
                        label="Promo link"
                        placeholder="Enter promo link..."
                        className='textField'
                        onChange={handleFormChange}
                        fullWidth
                        value={url || ''}
                    />
                    {!image &&
                        <Button className='imgUpload' onClick={openImageUpload}>
                            Upload Image
                        </Button>
                    }
                </div>
                <div className='popupFooter'>
                    <IconButton className='footerCheck' onClick={saveData}>
                        <Icon>done</Icon>
                    </IconButton>
                </div>
            </Popover>
            <ImageUploader
                type='promo'
                open={imageUploadOpen}
                onClose={closeImageUpload}
                onError={handleError}
                onSuccess={handleSuccess}
                id={id}
            />
        </React.Fragment>
    );
};

export default PromoEditHOC(Promo);