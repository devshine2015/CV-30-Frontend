import React from 'react';
import { TextField, Grid, Button, Select, MenuItem } from '@material-ui/core';
import S3Uploader from 'react-s3-uploader';

const NewJob = props => {
    const {
        formData: { title,
            description,
            expireDate,
            idealCandidate,
            teamId },
        handleFormChange,
        selectedBenefit, handleSelectBenefit,
        publishJob,
        getSignedUrl, onUploadStart, onProgress, onError, onFinishUpload, isUploading,
        teamsQuery: { loading, teams }
    } = props;
    if (loading)
        return <div>Loading...</div>
    return (
        <div className='newJobRoot'>
            <div className='header'>
                <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                    <TextField
                        name="title"
                        label="Job title"
                        placeholder="Job title..."
                        className='textField'
                        fullWidth
                        onChange={handleFormChange}
                        value={title || ''}
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
                                value={description || ''}
                            />
                        </section>
                        <section className='expireDate'>
                            <h2 className='sectionTitle'>Expiration <b>date</b></h2>
                            <p className='helperText'>
                                Select expiration date.
                            </p>
                            <TextField
                                name="expireDate"
                                type="date"
                                value={expireDate || new Date()}
                                onChange={handleFormChange}
                            />
                        </section>
                        <section className='benefits'>
                            <h2 className='sectionTitle'>Job <b>benefits</b></h2>
                            <p className='helperText'>
                                Add job benefits.
                            </p>
                            <Select
                                name='benefits'
                                value={selectedBenefit || ''}
                                onChange={handleSelectBenefit}
                            >
                                <MenuItem value="" disabled>
                                    <em>Select benefits</em>
                                </MenuItem>
                            </Select>
                        </section>
                        <section className='team'>
                            <h2 className='sectionTitle'>Associated <b>team</b></h2>
                            <p className='helperText'>
                                Add team.
                            </p>
                            <Select
                                name='teamId'
                                onChange={handleFormChange}
                                value={teamId || ''}
                            >
                                <MenuItem value="" disabled>
                                    <em>Select a team</em>
                                </MenuItem>
                                {
                                    teams && teams.map(team => <MenuItem value={team.id}>{team.name}</MenuItem>)
                                }

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
                                value={idealCandidate || ''}
                            />
                        </section>
                    </form>
                </Grid>
                <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'>
                    <div className='columnRightContent'>
                        <Button className='saveBtn' onClick={publishJob}>
                            Publish job
                        </Button>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default NewJob;