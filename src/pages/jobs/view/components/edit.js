import React from 'react';
import { compose, withState, withHandlers, pure } from 'recompose';
import { TextField, Grid, Button, Select, MenuItem } from '@material-ui/core';
import S3Uploader from 'react-s3-uploader';

const EditHOC = compose(
    withState('formData', 'setFormData', {}),
    withState('isUploading', 'setIsUploading', false),
    withState('uploadProgress', 'setUploadProgress', 0),
    withState('uploadError', 'setUploadError', null),
    withHandlers({
        handleFormChange: props => event => {
            const target = event.currentTarget;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;
            if (!name) {
                throw Error('Field must have a name attribute!');
            }
            props.setFormData(state => ({ ...state, [name]: value }));
        },
        getSignedUrl: () => async (file, callback) => {
            let getExtension = file.name.slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2);
            let fName = ['job', getExtension].join('.');

            const params = {
                fileName: fName,
                contentType: file.type
            };

            try {
                let response = await fetch('https://k73nyttsel.execute-api.eu-west-1.amazonaws.com/production/getSignedURL', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(params)
                });
                let responseJson = await response.json();
                callback(responseJson);
            } catch (error) {
                console.error(error);
                callback(error)
            }
        },
        renameFile: () => filename => {
            let getExtension = filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
            let fName = ['job', getExtension].join('.');
            return fName;
        },
        onUploadStart: ({ setIsUploading }) => (file, next) => {
            let size = file.size;
            if (size > 500 * 1024) {
                alert('File is too big!');
            } else {
                setIsUploading(true);
                next(file);
            }
        },
        onProgress: ({ setUploadProgress }) => (percent) => {
            setUploadProgress(percent);
        },
        onError: ({ setUploadError }) => error => {
            setUploadError(error);
            console.log(error);
        },
        onFinishUpload: ({ setIsUploading }) => () => {
            alert('done!');
            setIsUploading(false);
        }
    }),
    pure
);
const Edit = props => {
    const {
        formData, handleFormChange,
        selectedBenefit, handleSelectBenefit,
        selectedTeam, handleSelectTeam,
        getSignedUrl, onUploadStart, onProgress, onError, onFinishUpload, renameFile, isUploading
    } = props;

    const {
        title,
        description,
        expirationDate,
        idealCandidate
    } = formData;

    return (
        <React.Fragment>
            <div className='header'>
                <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                    <TextField
                        name="title"
                        label="Job title"
                        placeholder="Job title..."
                        className='textField'
                        fullWidth
                        onChange={handleFormChange}
                        value={title}
                        InputProps={{
                            classes: {
                                input: 'titleInput',
                            },
                        }}
                    />
                </Grid>
                <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'></Grid>
            </div>
            <Grid container className='mainBody jobEdit'>
                <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                    <form className='jobEditForm' noValidate autoComplete='off'>
                        <section className='mediaUpload'>
                            <p className='helperText'>
                                Add/Edit images or embed video links.
                            </p>
                            <label htmlFor="uploadJobImage">
                                <S3Uploader
                                    id="uploadJobImage"
                                    name="uploadJobImage"
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
                                    scrubFilename={(filename) => renameFile(filename)}

                                />
                                <Button component='span' className='mediaBtn' disabled={isUploading}>
                                    Add image
                                </Button>
                            </label>
                            <Button className='mediaBtn'>
                                Share video
                            </Button>
                        </section>
                        <section className='jobDescription'>
                            <h2 className='sectionTitle'>Job <b>description</b></h2>
                            <TextField
                                name="description"
                                label="Write your article below."
                                placeholder="Job description..."
                                className='textField'
                                fullWidth
                                multiline
                                rows={1}
                                rowsMax={10}
                                onChange={handleFormChange}
                                value={description}
                            />
                        </section>
                        <section className='expirationDate'>
                            <h2 className='sectionTitle'>Expiration <b>date</b></h2>
                            <p className='helperText'>
                                Select expiration date.
                            </p>
                            <TextField
                                name="expirationDate"
                                type="date"
                                value={expirationDate}
                                onChange={handleFormChange}
                            />
                        </section>
                        <section className='benefits'>
                            <h2 className='sectionTitle'>Job <b>benefits</b></h2>
                            <p className='helperText'>
                                Add job benefits.
                            </p>
                            <Select
                                value={selectedBenefit}
                                onChange={handleSelectBenefit}
                                inputProps={{
                                    name: 'age',
                                    id: 'age-simple',
                                }}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </section>
                        <section className='team'>
                            <h2 className='sectionTitle'>Associated <b>team</b></h2>
                            <p className='helperText'>
                                Add team.
                            </p>
                            <Select
                                value={selectedTeam}
                                onChange={handleSelectTeam}
                                inputProps={{
                                    name: 'age',
                                    id: 'age-simple',
                                }}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </section>
                        <section className='idealCandidate'>
                            <h2 className='sectionTitle'>Ideal <b>candidate</b></h2>

                            <TextField
                                name="idealCandidate"
                                label="Describe the ideal candidate below."
                                placeholder="The ideal candidate..."
                                className='textField'
                                fullWidth
                                multiline
                                rows={1}
                                rowsMax={10}
                                onChange={handleFormChange}
                                value={idealCandidate}
                            />
                        </section>
                    </form>
                </Grid>
                <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'>
                    <div className='columnRightContent'></div>
                </Grid>
            </Grid>

        </React.Fragment>

    );
}

export default EditHOC(Edit);
