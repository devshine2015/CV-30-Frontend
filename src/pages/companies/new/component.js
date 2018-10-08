import React from 'react';
import { Grid, TextField, Button, CircularProgress } from '@material-ui/core';
import { FormattedMessage } from 'react-intl'
import IndustryInput from '../../../components/IndustryInput';
import LocationInput from '../../../components/LocationInput';

const NewCompany = ({ cancel, values, touched, errors, isSubmitting, handleBlur, handleChange, handleSubmit, isValid }) => (
    <div className='newCompanyRoot'>
        <Grid container className='header'>
            <Grid item lg={6} sm={11}>
                <FormattedMessage id="company.new.headerTitle" defaultMessage="Create \ncompany profile" description="Create company profile">
                    {(text) => (
                        <h1 className='headerTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h1>
                    )}
                </FormattedMessage>
                <FormattedMessage id="company.new.headerMessage" defaultMessage="" description="New Company Header Message">
                    {(text) => (
                        <p className='headerMessage'>{text}</p>
                    )}
                </FormattedMessage>
                
            </Grid>
        </Grid>
        <Grid container className='mainBody newCompany'>
            <Grid item lg={6} sm={11}>
                <section className='locationSection'>
                    <LocationInput
                        updateFormState={val => handleChange({ target: { name: val[0].field, value: val[0].value }})}
                        value={values.location}
                        // schema={this.validation.location}

                        // onBlur={handleBlur}
                        // error={!!(touched.location && errors.location)}
                        // helperText={touched.location && errors.location}
                    />
                </section>
                <section className='titleSection'>
                    <FormattedMessage id="company.new.companyName" defaultMessage="Company name\nEnter company name..." description="Company Name">
                        {(text) => (
                            <TextField
                                name="name"
                                label={text.split("\n")[0]}
                                placeholder={text.split("\n")[1]}
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
                        )}
                    </FormattedMessage>
                    
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
                        updateFormState={val => handleChange({ target: { name: val[0].field, value: val[0].value }})}
                        value={values.industryId}
                        // schema={this.validation.industryId}
                    />
                    {/* <IndustryInput
                        className='textField'
                        fullWidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.industryId}
                        error={!!(touched.industryId && errors.industryId)}
                        //helperText={touched.industryId && errors.industryId}
                    /> */}
                    <FormattedMessage id="company.new.noOfEmployees" defaultMessage="Number of employees\nEnter number of employees..." description="Enter number of employees">
                        {(text) => (
                             <TextField
                                name="noOfEmployees"
                                label={text.split("\n")[0]}
                                placeholder={text.split("\n")[1]}
                                className='textField'
                                fullWidth
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.noOfEmployees}
                                error={!!(touched.noOfEmployees && errors.noOfEmployees)}
                                helperText={touched.noOfEmployees && errors.noOfEmployees}
                            />
                        )}
                    </FormattedMessage>
                   
                </section>
                <section className='actions'>
                    {isSubmitting && <CircularProgress />}
                    {!isSubmitting && <React.Fragment>
                        <FormattedMessage id="company.new.cancelBtn" defaultMessage="Cancel" description="Cancel">
                            {(text) => (
                                <Button className='cancelBtn' onClick={cancel}>{text}</Button>
                            )}
                        </FormattedMessage>
                        <FormattedMessage id="company.new.submitBtn" defaultMessage="Create company" description="Create company">
                            {(text) => (
                                <Button className={isValid ? 'submitBtn' : ''} disabled={!isValid} onClick={handleSubmit}>{text}</Button>
                            )}
                        </FormattedMessage>
                        
                    </React.Fragment>}
                </section>
            </Grid>
        </Grid>
    </div>
);

export default NewCompany;