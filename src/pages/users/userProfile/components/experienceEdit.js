import React from 'react';
import { TextField, Checkbox, FormLabel, FormControlLabel, IconButton, Icon, Switch as ToggleSwitch, FormGroup, Button } from '@material-ui/core';
import { compose, pure } from 'recompose';
import { graphql, withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import uuid from 'uuid/v4';
import { DatePicker } from 'material-ui-pickers';
import moment from 'moment';
import { withFormik } from 'formik';
import * as yup from 'yup';
import { FormattedMessage } from 'react-intl'
import { setExperienceMutation, setProjectMutation, setFeedbackMessage, setHobbyMutation, setEducationMutation } from '../../../../store/queries';
import { currentProfileRefetch } from '../../../../store/refetch';
import ImageUploader from '../../../../components/imageUploader';
import LocationInput from '../../../../components/LocationInput';
import EducationLevelInput from '../../../../components/EducationLevelInput';
import { s3BucketURL } from '../../../../constants/s3';

class ExperienceEdit extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            imageUploadOpen: false
        };
    }
    openImageUpload = () => this.setState({ imageUploadOpen: true });
    closeImageUpload = () => this.setState({ imageUploadOpen: false });
    removeImage = () => this.props.setFieldValue('images', []);
    handleStartDateChange = startDate => this.props.setFieldValue('startDate', startDate);
    handleEndDateChange = endDate => this.props.setFieldValue('endDate', endDate);
    handleError = async error => {
        console.log(error);
        await this.props.setFeedbackMessage({
            variables: {
                status: 'error',
                message: error || error.message
            }
        });
    }
    handleSuccess = ({ path, filename }) => {
        const { id, images } = this.props.values;
        let image = {
            id: uuid(),
            sourceType: this.props.type,
            source: id, //article id
            path: path ? path : `/${this.props.type}/${id}/${filename}`
        };
        this.props.setFieldValue('images', images.concat([image]));
    }
    renderSubTitle = (type) => {
        return 'Add / edit ' + type
    }
    render() {
        const { imageUploadOpen } = this.state;
        const {
            isSubmitting, values, handleChange, handleBlur, isValid,
            closeEditor,
            submitForm,
            type,
            userId
        } = this.props;

        const { id, position, company, location, startDate, endDate, isCurrent, description, video, images, isVideoUrl } = values;
        const image = images && !!images.length ? { id: images[0].id, path: images[0].path, sourceType: type } : null;
        
        return (
            <div className='experienceForm'>
                <h4>
                    {this.renderSubTitle(type)}
                </h4>
                <section className='infoSection'>
                    {
                        type === "education" ?
                        <EducationLevelInput
                            value={position}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        :
                        <FormattedMessage id="users.addPositionField" defaultMessage="Add position\nPosition..." description="Position">
                            {(text) => (
                                <TextField
                                    name="position"
                                    label={text.split("\n")[0]}
                                    placeholder={text.split("\n")[1]}
                                    className='textField'
                                    fullWidth
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={position || ''}
                                />
                            )}
                        </FormattedMessage>
                        
                    }
                    <FormattedMessage id="users.addCompanyField" defaultMessage="Add institution\nAdd company\nCompany..." description="Company">
                        {(text) => (
                            <TextField
                                name="company"
                                label={type === 'education'? text.split("\n")[0] : text.split("\n")[0]}
                                placeholder={text.split("\n")[2]}
                                className='textField'
                                fullWidth
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={company || ''}
                            />
                        )}
                    </FormattedMessage>
                    
                    <LocationInput
                        value={location}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    <div className='datePickers'>
                        <FormattedMessage id="users.date" defaultMessage="Date" description="Date">
                            {(text) => (
                                 <p>{text}</p>
                            )}
                        </FormattedMessage>
                        <FormattedMessage id="users.startDate" defaultMessage="Start Date" description="Start Date">
                            {(text) => (
                                <DatePicker
                                    label={text}
                                    format="DD/MM/YYYY"
                                    maxDate={endDate || new Date()}
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                    animateYearScrolling
                                />
                            )}
                        </FormattedMessage>
                        <FormattedMessage id="users.endDate" defaultMessage="End Date" description="End Date">
                            {(text) => (
                                <DatePicker
                                    label={text}
                                    format="DD/MM/YYYY"
                                    disabled={isCurrent}
                                    disableFuture={true}
                                    minDate={startDate || ''}
                                    value={endDate}
                                    onChange={this.handleEndDateChange}
                                    animateYearScrolling
                                />
                            )}
                        </FormattedMessage>
                        
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name='isCurrent'
                                    checked={isCurrent || false}
                                    onChange={handleChange}
                                    color="primary"
                                />
                            }
                            label="Still work there"
                        />
                    </div>
                    <FormattedMessage id="users.addDescriptionField" defaultMessage="Add description\nDescription..." description="Description">
                        {(text) => (
                             <TextField
                                name="description"
                                label={text.split("\n")[0]}
                                placeholder={text.split("\n")[1]}
                                fullWidth
                                multiline
                                className='textField'
                                rowsMax="4"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={description || ''}
                            />
                        )}
                    </FormattedMessage>
                    
                    <FormGroup row className='mediaToggle'>
                        <FormattedMessage id="feed.mediaToggleLabel" defaultMessage="Upload visuals" description="Upload visuals">
                            {(text) => (
                                <span className='mediaToggleLabel'>{text}</span>
                            )}
                        </FormattedMessage>
                        <FormattedMessage id="feed.photo" defaultMessage="Photo" description="Photo">
                            {(text) => (
                                <FormLabel className={!isVideoUrl ? 'active' : ''}>{text}</FormLabel>
                            )}
                        </FormattedMessage>
                        
                        <ToggleSwitch
                            name='isVideoUrl'
                            checked={isVideoUrl}
                            onChange={handleChange}
                            classes={{
                                switchBase: 'colorSwitchBase',
                                checked: 'colorChecked',
                                bar: 'colorBar',
                            }}
                            color="primary" />
                        <FormattedMessage id="feed.videoUrl" defaultMessage="Video Url" description="Video Url">
                            {(text) => (
                                <FormLabel className={isVideoUrl ? 'active' : ''}>{text}</FormLabel>
                            )}
                        </FormattedMessage>
                        
                    </FormGroup>

                </section>
                <section className='mediaUpload'>
                    {isVideoUrl ?
                        <FormattedMessage id="feed.addVideoUrl" defaultMessage="Add video URL \n Video URL..." description="Add video URL">
                            {(text) => (
                                <TextField
                                    name="video"
                                    label={text.split("\n")[0]}
                                    placeholder={text.split("\n")[1]}
                                    fullWidth
                                    className='textField'
                                    value={video}
                                    onChange={handleChange}
                                />
                            )}
                        </FormattedMessage>
                         :
                        <React.Fragment>
                            {image ?
                                <div className="imagePreview">
                                    <img src={`${s3BucketURL}${image.path}`} className='previewImg' alt='' />
                                    <IconButton className='removeBtn' onClick={this.removeImage}>
                                        <Icon>cancel</Icon>
                                    </IconButton>
                                </div> :
                                <FormattedMessage id="feed.imageUpload" defaultMessage="Upload" description="Upload">
                                        {(text) => (
                                            <Button className='uploadBtn' onClick={this.openImageUpload}>
                                                {text}
                                            </Button>
                                        )}
                                </FormattedMessage>
                                
                            }
                            <ImageUploader
                                id={id}
                                type={type}
                                open={imageUploadOpen}
                                onClose={this.closeImageUpload}
                                onError={this.handleError}
                                onSuccess={this.handleSuccess}
                                userId={userId}
                            />
                        </React.Fragment>

                    }
                </section>
                <section className='editControls'>
                    <IconButton className='cancelBtn' onClick={closeEditor} disabled={isSubmitting}>
                        <Icon>close</Icon>
                    </IconButton>
                    <IconButton className='submitBtn' style={isValid ? {} : { color: '#aaa', background: '#fff', border: '1px solid #aaa' }} onClick={submitForm} disabled={isSubmitting || !isValid}>
                        <Icon>done</Icon>
                    </IconButton>
                </section>
            </div>
        )
    }
};

export default compose(
    withRouter,
    withApollo,
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withFormik({
        mapPropsToValues: ({
            job: { id, company = '', position = '', location = '', startDate = null, endDate = null, isCurrent = false, description = '', videos = [], images = [] } = {}
        }) => ({ 
            id: id || uuid(),
            company,
            position,
            location,
            startDate: startDate || moment().subtract(1, 'days'),
            endDate: endDate || moment().subtract(1, 'days'),
            isCurrent,
            description,
            video: videos.length ? videos[0].path : '',
            images,
            isVideoUrl: !((images && images.length) || false)
        }),
        validationSchema: yup.object().shape({
            location: yup.string().trim().max(255).required('Please enter a location'),
            isCurrent: yup.boolean(),
            position: yup.string()
                .max(255, 'Experience position cannot be longer than 255 chars')
                .required(),
            company: yup.string()
                .required('Company cannot be null')
                .max(255, 'Experience company cannot be longer than 255 chars'),
            startDate: yup.date().required('Please provide a start date.'),
            endDate: yup.date(),
            title: yup.string().trim()
                .max(255, 'Project title cannot be longer than 255 chars')
                .nullable(),
            description: yup.string().nullable(),
            images: yup.array().of(yup.object().shape({
                id: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
                title: yup.string().trim().max(255),
                description: yup.string().trim(),
                isFeatured: yup.boolean(),
                source: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
                sourceType: yup.string().matches(/(article|profile|profile_cover|company|company_cover|job|team|experience|project)/, { excludeEmptyString: true }),
                path: yup.string().trim().max(255)
            })),
            video: yup.string().trim().max(255).url()
        }),
        handleSubmit: async (values, { props: { job: { videos: oldVideos } = {}, type, match, closeEditor, setFeedbackMessage, client }, setSubmitting }) => {
            let { id, title, description, position, company, startDate, endDate, isCurrent, images, video, location } = values;
            const videos = []; //, images = [];
            let videoId = null;
            if (video) {
                if (oldVideos && oldVideos.length) videoId = oldVideos[0].id;
                videos.push({
                    id: videoId || uuid(),
                    source: id,
                    path: video || '',
                    sourceType: type
                });
            }
           
            
            try {
                await client.mutate({
                    mutation : type === 'experience'? setExperienceMutation : type === 'project'? setProjectMutation : type === 'education'?  setEducationMutation : setHobbyMutation,
                    variables: {
                        [type]: {
                            id,
                            location,
                            title,
                            description,
                            position,
                            company,
                            startDate,
                            endDate: isCurrent ? undefined : endDate,
                            isCurrent,
                            videos,
                            images
                        },
                        language: match.params.lang
                    },
                    refetchQueries: [
                        currentProfileRefetch(match.params.lang)
                    ]
                });
                await setFeedbackMessage({
                    variables: {
                        status: 'success',
                        message: 'Changes saved successfully.'
                    }
                });
                closeEditor();
                } catch ({ graphQLErrors }) {
                    let formattedError = graphQLErrors && graphQLErrors[0].reduce((result, current) => {
                        result += "\n" + current.message;
                        return result;
                    }, '')
                    await setFeedbackMessage({
                        variables: {
                            status: 'error',
                            message: formattedError
                        }
                    });
            }
        },
        displayName: 'ExperienceForm'
    }),
    pure
)(ExperienceEdit);