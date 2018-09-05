import React from 'react';
import {
    Grid, TextField, Button, CircularProgress
    // Avatar, Icon, , IconButton, Field
} from '@material-ui/core';
// import S3Uploader from 'react-s3-uploader';
import { graphql } from 'react-apollo';
import { compose, pure } from 'recompose';
import { withFormik } from 'formik';
import { withRouter } from 'react-router-dom';

import { setFeedbackMessage } from '../../../store/queries';
import { companiesRefetch } from '../../../store/refetch';
import schema from './validation';

import IndustryInput from '../../../components/IndustryInput';
import LocationInput from '../../../components/LocationInput';

const NewCompany = props => {
    const {
        // getSignedUrl, onUploadStart, onProgress, onError, onFinishUpload, isUploading, uploadProgress,
        cancel,
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
                        <LocationInput
                            value={values.location}
                            onChange={handleChange}
                            error={touched.location && errors.location}
                            helperText={errors.location}
                        />
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
                        <IndustryInput
                            error={touched.industry && errors.industry}
                            helperText={errors.industry}
                            onChange={handleChange}
                            value={values.industry}
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
                        {isSubmitting && <CircularProgress />}
                        {!isSubmitting && <React.Fragment>
                            <Button className='cancelBtn' onClick={cancel}>Cancel</Button>
                            <Button className={isValid ? 'submitBtn' : ''} disabled={!isValid} onClick={handleSubmit}>Create company</Button>
                        </React.Fragment>}
                    </section>
                </Grid>
            </Grid>
        </div>
    )
}

const NewCompanyHOC = compose(
    withRouter,
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withFormik({
        mapPropsToValues: () => ({
            name: '',
            industry: '',
            noOfEmployees: '',
            location: ''
        }),
        validationSchema: schema,
        handleSubmit: async (values, { props: { handleCompany, match, history, setFeedbackMessage }, setSubmitting }) => {
            try {
                await handleCompany({
                    variables: {
                        language: match.params.lang,
                        details: values
                    },
                    refetchQueries: [
                        companiesRefetch(match.params.lang)
                    ]
                });

                await setFeedbackMessage({
                    variables: {
                        status: 'success',
                        message: 'Changes saved successfully.'
                    }
                });

                history.push(`/${match.params.lang}/companies`);

            } catch (err) {
                await setFeedbackMessage({
                    variables: {
                        status: 'error',
                        message: err.message
                    }
                });
            }
            setSubmitting(false);
        },
        displayName: 'AddCompanyForm', // helps with React DevTools
    }),
    pure
)

export default NewCompanyHOC(NewCompany);