import React from 'react';
import { Grid, TextField, Button, CircularProgress } from '@material-ui/core';

import IndustryInput from '../../../components/IndustryInput';
import LocationInput from '../../../components/LocationInput';

const NewCompany = ({ cancel, values, touched, errors, isSubmitting, handleBlur, handleChange, handleSubmit, isValid }) => (
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
                        onBlur={handleBlur}
                        error={!!(touched.location && errors.location)}
                        helperText={touched.location && errors.location}
                    />
                </section>
                <section className='titleSection'>
                    <TextField
                        name="name"
                        label="Company name"
                        placeholder="Enter company name..."
                        className='textField'
                        fullWidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.name}
                        error={!!(touched.name && errors.name)}
                        helperText={touched.name && errors.name}
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
                        className='textField'
                        fullWidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.industryId}
                        error={!!(touched.industryId && errors.industryId)}
                        //helperText={touched.industryId && errors.industryId}
                    />

                    <TextField
                        name="noOfEmployees"
                        label="Number of employees"
                        placeholder="Enter number of employees..."
                        className='textField'
                        fullWidth
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.noOfEmployees}
                        error={!!(touched.noOfEmployees && errors.noOfEmployees)}
                        helperText={touched.noOfEmployees && errors.noOfEmployees}
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
);

export default NewCompany;