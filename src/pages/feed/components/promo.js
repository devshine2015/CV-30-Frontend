import React, { Component } from 'react';
// import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql, compose } from 'react-apollo';
import { Popover, IconButton, Icon, TextField, Button } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import uuid from 'uuidv4';
import { FormattedMessage } from 'react-intl'
import { getCurrentUser, getAds, handleAd, setFeedbackMessage } from '../../../store/queries';
import { adsRefetch } from '../../../store/refetch';
import Loader from '../../../components/Loader';
import ImageUploader from '../../../components/imageUploader';
import { s3BucketURL, adsFolder } from '../../../constants/s3';
/*

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
            id: (ads && ads[0] && ads[0].id) ? ads[0].id : uuid(),
            url: (ads && ads[0] && ads[0].url) ? ads[0].url : null,
            image: (ads && ads[0] && ads[0].image) ? ads[0].image : null
        },
        promoAnchor: null,
        imageUploadOpen: false
    })),
    withHandlers({
        handleFormChange: ({ state, setState }) => event => {
            const target = event.currentTarget;
            const name = target.name;
            const value = target.value;
            if (!name) {
                throw Error('Field must have a name attribute!');
            }
            setState({ ...state, formData: { ...state.formData, [name]: value } });
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
        handleSuccess: ({ state, setState }) => ({ path, filename }) => {
            const imgPath = path ? path : `/${adsFolder}/${state.id}/${filename}`;
            const image = {
                id: uuid(),
                sourceType: 'ad',
                path: imgPath
            };
            setState({ ...state, formData: { ...state.formData, image } });
        },
        removeImage: ({ state, setState }) => () => setState({ ...state, image: null }),
        saveData: ({ state, setState, handleAd, setFeedbackMessage, match: { params: { lang: language } } }) => async () => {
            const { id, url, image } = state;
            try {
                await handleAd({
                    variables: {
                        language,
                        details: { id, url, image }
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

const Promo = (props) => {
   

    return (
        
    );
};

export default PromoEditHOC(Promo);
*/

class Promo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: uuid(),
            url: null,
            image: null,
            promoAnchor: null,
            imageUploadOpen: false
        };
    }

    handleFormChange = event => {
        const target = event.currentTarget;
        const name = target.name;
        const value = target.value;
        if (!name) {
            throw Error('Field must have a name attribute!');
        }
        this.setState({ [name]: value });
    };

    openPromoEditor = ev => {
        const { getAds: {  ads: [ ad ] = [] } } = this.props;
        const adImage = (ad && ad.image) || null;
        let image = null;
        if (adImage) image = {
            id: adImage.id,
            path: adImage.path
        };
        this.setState({ promoAnchor: ev.target, url: (ad && ad.url) || '', image });
    }
    closePromoEditor = () => this.setState({ promoAnchor: null });

    openImageUpload = () => this.setState({ imageUploadOpen: true });
    closeImageUpload = () => this.setState({ imageUploadOpen: false });

    handleError = async error => {
        await this.props.setFeedbackMessage({
            variables: {
                status: 'error',
                message: JSON.stringify(error, null, 2)
            }
        });
    };
    handleSuccess = ({ path, filename, id }) => {
        let imgPath = path ? path : `/${adsFolder}/${this.state.id}/${filename}`;
        let image = {
            id: id || uuid(),
            sourceType: 'ad',
            path: imgPath
        };
        this.setState({ image }, () => console.log(this.state));
    };
    removeImage = () => this.setState({ image: null });
    saveData = async () => {
        const { handleAd, setFeedbackMessage, match: { params: { lang: language } } } = this.props;
        const { id, url, image } = this.state;
        try {
            await handleAd({
                variables: {
                    language,
                    details: { id, url, image }
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
            this.setState({
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



    render() {
        const {
            getAds: { loading: adsLoading, ads },
            currentUser: { loading: userLoading, auth: { currentUser } }
        } = this.props;

        const { id, url, image, promoAnchor, imageUploadOpen } = this.state;

        if (adsLoading || userLoading)
            return <Loader />

        const ad = (ads && ads[0]) ? ads[0] : null;

        return (
            <React.Fragment>
                <section className='promo'>
                    {ad ?
                        <a href={ad.url} className='promoLink' target='_blank' rel="noopener noreferrer">
                            <img src={`${s3BucketURL}${ad.image.path}`} className='promoImg' alt='' />
                        </a>
                        :
                        <FormattedMessage id="feed.promo" defaultMessage="Promo" description="Promo">
                                {(text) => (<span className='noPromo'>{text}</span>)}
                        </FormattedMessage>
                    
                    }
                    {(currentUser && currentUser.god) &&
                        <IconButton className='floatingEditBtn' onClick={this.openPromoEditor}>
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
                    onClose={this.closePromoEditor}
                    classes={{
                        paper: 'promoEditPaper'
                    }}
                >
                    <div className='popupBody'>
                        {image &&
                            <div className='media'>
                                <img src={`${s3BucketURL}${image.path}`} alt='ad' />
                                <IconButton className='deleteBtn' onClick={this.removeImage}>
                                    <Icon>close</Icon>
                                </IconButton>
                            </div>
                        }
                        <FormattedMessage id="feed.promoLink" defaultMessage="Promo link \n Enter promo link..." description="Enter promo link">
                            {(text) => (
                                <TextField
                                    name="url"
                                    label={text.split("\n")[0]}
                                    placeholder={text.split("\n")[1]}
                                    className='textField'
                                    onChange={this.handleFormChange}
                                    fullWidth
                                    value={url || ''}
                                />
                            )}
                        </FormattedMessage>
                        

                        { !image && 
                            <FormattedMessage id="feed.imgUpload" defaultMessage="Upload Image" description="Upload Image">
                                    {(text) => (
                                        <Button className='imgUpload' onClick={this.openImageUpload}>
                                            {text}
                                        </Button> 
                                    )}
                            </FormattedMessage>
                            
                        }

                    </div>
                    <div className='popupFooter'>
                        <IconButton className='footerCheck' onClick={this.saveData}>
                            <Icon>done</Icon>
                        </IconButton>
                    </div>
                </Popover>
                <ImageUploader
                    type='promo'
                    open={imageUploadOpen}
                    onClose={this.closeImageUpload}
                    onError={this.handleError}
                    onSuccess={this.handleSuccess}
                    id={id}
                />
            </React.Fragment>
        )
    }
}

export default compose(
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
)(Promo);