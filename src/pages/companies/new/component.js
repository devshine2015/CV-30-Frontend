import React from 'react';
import {
    Grid, TextField, Button, CircularProgress
    // Avatar, Icon, , IconButton, Field
} from '@material-ui/core';
// import S3Uploader from 'react-s3-uploader';
import { graphql } from 'react-apollo';
import { compose, pure, lifecycle, withHandlers, withState } from 'recompose';
import { withFormik } from 'formik';

import { googleMapsQuery } from '../../../store/queries';
import schema from './validation';

const NewCompany = props => {
    const {
        // getSignedUrl, onUploadStart, onProgress, onError, onFinishUpload, isUploading, uploadProgress,
        cancel, save, autocompleteHandle,
        googleMapsData: { googleMaps },
        values, touched, errors, isSubmitting, handleChange, handleSubmit, isValid
    } = props;
    return (
        <div className='newCompanyRoot'>
            <Grid container className='header'>
                <Grid item lg={6} sm={11}>
                    <h1 className='headerTitle'>Create <b>company profile</b></h1>
                    <p className='headerMessage'>Novum quando similique ei sed. Porro convenire scriptorem vim ei, an vim decore prodesset. Quem appetere delicatissimi vis ei, eos stet partem noster at, cu duo mazim utamur intellegebat. Mea no sint choro noluisse, pro duis dissentiet ea. Ea enim numquam nam.</p>
                </Grid>
            </Grid>
            <Grid container className='mainBody newCompany'>
                <Grid item lg={6} sm={11}>
                    <section className='locationSection'>
                        { googleMaps.isLoaded && typeof window.google != "undefined" && <TextField
                            error={touched.location && errors.location}
                            helperText={errors.location}
                            inputRef={autocompleteHandle}
                            name="location"
                            label="Location"
                            placeholder="Enter location..."
                            className='textField'
                            fullWidth
                            onChange={handleChange}
                            value={values.location}
                        />}
                    </section>
                    <section className='titleSection'>
                        <TextField
                            error={touched.name && errors.name}
                            helperText={errors.name}
                            name="name"
                            label="Company name"
                            placeholder="Enter company name..."
                            className='textField'
                            fullWidth
                            onChange={handleChange}
                            value={values.name}
                            InputProps={{
                                classes: {
                                    input: 'titleInput',
                                }
                            }}
                        />
                    </section>
                    {/* <section className='mediaSection'>
                        <div className='avatar'>
                            <Avatar src='' alt='company pic' className='companyAvatarPreview' />
                            <label htmlFor="uploadProfileImg">
                                <S3Uploader
                                    id="uploadProfileImg"
                                    name="uploadProfileImg"
                                    className='hiddenInput'
                                    getSignedUrl={getSignedUrl}
                                    accept="image/*"
                                    preprocess={onUploadStart}
                                    onProgress={onProgress}
                                    onError={onError}
                                    onFinish={onFinishUpload}
                                    uploadRequestHeaders={{
                                        'x-amz-acl': 'public-read',
                                    }}
                                />
                                <IconButton component='span' className='badgeRoot' disabled={isUploading}>
                                    <Icon>
                                        camera_alt
                                    </Icon>
                                </IconButton>
                            </label>
                            {isUploading &&
                                <CircularProgress
                                    className='avatarLoadCircle'
                                    value={uploadProgress}
                                    size={130}
                                    variant='determinate'
                                    thickness={2}
                                />
                            }
                        </div>
                        <div className='colorPicker'></div>
                    </section> */}
                    <section className='details'>
                        <TextField
                            error={touched.activityField && errors.activityField}
                            helperText={errors.activityField}
                            name="activityField"
                            label="Field of Activity"
                            placeholder="Enter field of activity..."
                            className='textField'
                            fullWidth
                            onChange={handleChange}
                            value={values.activityField}
                        />
                        <TextField
                            error={touched.noOfEmployees && errors.noOfEmployees}
                            helperText={errors.noOfEmployees}
                            name="noOfEmployees"
                            label="Number of employees"
                            placeholder="Enter number of employees..."
                            className='textField'
                            fullWidth
                            onChange={handleChange}
                            value={values.noOfEmployees}
                        />
                    </section>
                    <section className='actions'>
                        { isSubmitting && <CircularProgress /> }
                        { !isSubmitting && <React.Fragment>
                            <Button className='cancelBtn' onClick={cancel}>Cancel</Button>
                            <Button className={isValid ? 'submitBtn' : ''} disabled={!isValid} onClick={handleSubmit}>Create company</Button>
                        </React.Fragment> }
                    </section>
                </Grid>
            </Grid>
        </div>
    )
}

const NewCompanyHOC = compose(
    graphql(googleMapsQuery, { name: 'googleMapsData' }),
    withState('isAutocompleteInit', 'setAutocompleteInit', false),
    withState('autocompleteHandle', '', () => React.createRef()),
    withFormik({
        mapPropsToValues: () => ({
            name: '',
            activityField: '',
            noOfEmployees: '',
            location: '',
            place: {
                addressComponents: null,
                formattedAddress: null,
                latitude: null,
                longitude: null,
                internationalPhoneNumber: null,
                name: null,
                placeId: null,
                compoundCode: null,
                globalCode: null,
                rating: null,
                reviews: null,
                types: null,
                googleUrl: null,
                website: null
            }
        }),
        validationSchema: schema,
        handleSubmit: async (values, { props: { handleCompany, match }, setSubmitting }) => {
            try {
                await handleCompany({
                    variables: {
                        language: match.params.lang,
                        details: values
                    }
                });
            } catch (error) {
                console.log(error);
            }
            setSubmitting(false);
        },
        displayName: 'AddCompanyForm', // helps with React DevTools
    }),
    withHandlers({
        initAutocomplete: ({ isAutocompleteInit, setAutocompleteInit, autocompleteHandle, setFieldValue, values }) => () => {
            if (isAutocompleteInit) return;
            const autocompleteInstance = new window.google.maps.places.Autocomplete(autocompleteHandle.current);
            autocompleteInstance.addListener('place_changed', () => {
                const place = autocompleteInstance.getPlace();
                if (!place.geometry) {
                    window.alert("No details available for input: '" + place.name + "'");
                    return;
                }
                if (place) {
                    setFieldValue('place', {
                        addressComponents: place.address_components ? JSON.stringify(place.address_components) : null,
                        formattedAddress: place.formatted_address ? place.formatted_address : null,
                        latitude: place.geometry && place.geometry.location ? place.geometry.location.lat() : null,
                        longitude: place.geometry && place.geometry.location ? place.geometry.location.lng() : null,
                        internationalPhoneNumber: place.international_phone_number ? place.international_phone_number : null,
                        name: place.name ? place.name : null,
                        placeId: place.placeId ? place.placeId : null,
                        compoundCode: place.plus_code && place.plus_code.compound_code ? place.plus_code.compound_code : null,
                        globalCode: place.plus_code && place.plus_code.global_code ? place.plus_code.global_code : null,
                        rating: place.rating ? place.rating : null,
                        reviews: place.reviews ? JSON.stringify(place.reviews) : null,
                        types: place.types ? JSON.stringify(place.types) : null,
                        googleUrl: place.url ? place.url : null,
                        website: place.website ? place.website : null
                    }, true);
                    if (place.formatted_address) setFieldValue('location', place.formatted_address, true);
                    if (place.name) setFieldValue('name', place.name, true);
                    if (place.types) setFieldValue('activityField', place.types.map(item => (item.charAt(0).toUpperCase() + item.slice(1)).replace(/_/ig, ' ')).join(', '), true);
                }
            });
            setAutocompleteInit(true);
        }
    }),
    lifecycle({
        componentDidMount() {
            if (this.props.googleMapsData.googleMaps.isLoaded && window.google && !this.props.isAutocompleteInit) this.props.initAutocomplete();
        },
        componentDidUpdate() {
            if (this.props.googleMapsData.googleMaps.isLoaded && window.google && !this.props.isAutocompleteInit) this.props.initAutocomplete();
        }
    }),
    pure
)

export default NewCompanyHOC(NewCompany);