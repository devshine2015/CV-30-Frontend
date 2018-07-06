import React from 'react';
import { Grid, TextField, Avatar, Button, Icon, CircularProgress, IconButton } from '@material-ui/core';
import S3Uploader from 'react-s3-uploader';
import MUIPlacesAutocomplete from 'mui-places-autocomplete';

const NewCompany = props => {
    const {
        formData, handleFormChange,
        getSignedUrl, onUploadStart, onProgress, onError, onFinishUpload, isUploading, uploadProgress,
        cancel, save
    } = props;
    const { name, field, employees, location } = formData;

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
                    <section className='titleSection'>
                        <TextField
                            name="name"
                            label="Company name"
                            placeholder="Enter company name..."
                            className='textField'
                            fullWidth
                            onChange={handleFormChange}
                            value={name || ''}
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
                            name="field"
                            label="Activity field"
                            placeholder="Enter activity field..."
                            className='textField'
                            fullWidth
                            onChange={handleFormChange}
                            value={field || ''}
                        />
                        <TextField
                            name="employees"
                            label="Number of employees"
                            placeholder="Enter number of employees..."
                            className='textField'
                            fullWidth
                            onChange={handleFormChange}
                            value={employees || ''}
                        />
                        <MUIPlacesAutocomplete
                            onSuggestionSelected={() => {}}
                            renderTarget={() => {}}
                            name={'location'}
                        />
                        {/* <TextField
                            name="location"
                            label="Location"
                            placeholder="Enter location..."
                            className='textField'
                            fullWidth
                            onChange={handleFormChange}
                            value={location || ''}
                        /> */}
                    </section>
                    <section className='actions'>
                        <Button className='cancelBtn' onClick={cancel}>Cancel</Button>
                        <Button className='submitBtn' onClick={save}>Create company</Button>
                    </section>
                </Grid>
            </Grid>
        </div>
    )
}

export default NewCompany;