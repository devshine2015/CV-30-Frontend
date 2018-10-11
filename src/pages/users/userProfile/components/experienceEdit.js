import React from 'react';
import { IconButton, Icon } from '@material-ui/core';
import { compose, pure } from 'recompose';
import { graphql, withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import uuid from 'uuid/v4';
import moment from 'moment';
import * as yup from 'yup';
import { FormattedMessage } from 'react-intl';

import { setExperienceMutation, setProjectMutation, setFeedbackMessage, setHobbyMutation, setEducationMutation } from '../../../../store/queries';
import { currentProfileRefetch } from '../../../../store/refetch';
import { InputHOC, PeriodDatePickers, Media } from '../../../../components/FormHOCs';
import LocationInput from '../../../../components/LocationInput';
import EducationLevelInput from '../../../../components/EducationLevelInput';

class ExperienceEdit extends React.Component {
    validation = {
        position: yup.string().max(255, 'Experience position cannot be longer than 255 chars').required(),
        company: yup.string().required('Company cannot be null').max(255, 'Experience company cannot be longer than 255 chars'),
        startDate: yup.date().required('Please provide a start date'),
        endDate: yup.date(),
        location: yup.date().required('Please provide a location'),
        description: yup.string().nullable(),
        videoSchema: yup.string().trim().max(255).url()
    }
    state = {
        formData: {
            id: (this.props.job && this.props.job.id) || uuid(),
            company: (this.props.job && this.props.job.company) || "",
            position: (this.props.job && this.props.job.position) || "",
            location: (this.props.job && this.props.job.location) || "",
            startDate: (this.props.job && this.props.job.startDate) || moment().subtract(1, 'days'),
            endDate: (this.props.job && this.props.job.endDate) || moment().subtract(1, 'days'),
            isCurrent: (this.props.job && this.props.job.isCurrent) || false,
            description: (this.props.job && this.props.job.description) || "",
            video: (this.props.job && this.props.job.videos && this.props.job.videos[0] && this.props.job.videos[0].path) || "",
        },
        fieldsValidity: {
            position: (this.props.job && this.props.job.position) ? this.validation.position.isValid(this.props.job.position) : false,
            company: (this.props.job && this.props.job.company) ? this.validation.company.isValid(this.props.job.company) : false,
            location: (this.props.job && this.props.job.location) ? this.validation.location.isValid(this.props.job.location) : false,
            startDate: true,
            video: (this.props.job && this.props.job.videos && this.props.job.videos[0] && this.props.job.videos[0].path) ? this.validation.videoSchema.isValid(this.props.job.videos[0].path) : true,
        },
        formStatus: {
            isValid: false
        }
    }
    handleSubmit = async () => {
        const { job: { videos: oldVideos } = {}, type, match, closeEditor, setFeedbackMessage } = this.props;
        let { id, title, description, position, company, startDate, endDate, isCurrent, images, video, location } = this.state.formData;
        const videos = [];
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
            await this.props.client.mutate({
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
    }
    
    shouldComponentUpdate = (nextProps, nextState) => {
        return this.state.formStatus.isValid !== nextState.formStatus.isValid;
    }

    handleChange = values => {
        let formData = { ...this.state.formData };
        let fieldsValidity = { ...this.state.fieldsValidity };
        values.map(item => {
            formData[item.field] = item.value;
            fieldsValidity[item.field] = item.valid;
            return null;
        });
        this.setState({
            formData,
            fieldsValidity,
            formStatus: {
                isValid: Object.keys(fieldsValidity).reduce((accumulator, currentValue) => accumulator && fieldsValidity[currentValue], true)
            }
        }, () => console.log(this.state));
    }

    render() {
        console.log("Experience Edit");
        const { closeEditor, type, userId } = this.props;
        const { company, position, location, startDate, endDate, isCurrent, description, video, images } = this.state.formData; 
        return (
            <div className='experienceForm'>
                <h4>
                    { 'Add / Edit ' + type }
                </h4>
                <section className='infoSection'>
                    {
                        type === "education" ?
                        <EducationLevelInput name="position" updateFormState={this.handleChange} value={location} schema={this.validation.position} />
                        :
                        <FormattedMessage id="users.addPositionField" defaultMessage="Add position\nPosition..." description="Position">
                            { text => <InputHOC key="position" updateFormState={this.handleChange} fullWidth={true} value={position} name="position" label={text.split("\n")[0]} placeholder={text.split("\n")[1]} schema={this.validation.position} /> }
                        </FormattedMessage>
                        
                    }
                    <FormattedMessage id="users.addCompanyField" defaultMessage="Add institution\nAdd company\nCompany..." description="Company">
                        { text => <InputHOC key="company" updateFormState={this.handleChange} fullWidth={true} value={company} name="company" label={text.split("\n")[0]} placeholder={text.split("\n")[1]} schema={this.validation.company} /> }
                    </FormattedMessage>
                    <LocationInput updateFormState={this.handleChange} value={location} schema={this.validation.location} />
                    <PeriodDatePickers updateFormState={this.handleChange} startDate={startDate} endDate={endDate} isCurrent={isCurrent} startDateSchema={this.validation.startDate} endDateSchema={this.validation.endDate} />
                    <FormattedMessage id="users.addDescriptionField" defaultMessage="Add description\nDescription..." description="Description">
                        { text => <InputHOC key="description" updateFormState={this.handleChange} rowsMax={4} multiline={true} fullWidth={true} value={description} name="description" label={text.split("\n")[0]} placeholder={text.split("\n")[1]} schema={this.validation.description} /> }
                    </FormattedMessage>
                    <Media setFeedbackMessage={this.props.setFeedbackMessage} updateFormState={this.handleChange} type={type} userId={userId} sourceId={this.state.formData.id} video={video} images={images} videoSchema={this.validation.videoSchema} />
                </section>
                <section className='editControls'>
                    <IconButton className='cancelBtn' onClick={closeEditor} disabled={false}>
                        <Icon>close</Icon>
                    </IconButton>
                    <IconButton className='submitBtn' style={this.state.formStatus.isValid ? {} : { color: '#aaa', background: '#fff', border: '1px solid #aaa' }} onClick={this.handleSubmit} disabled={!this.state.formStatus.isValid}>
                        <Icon>done</Icon>
                    </IconButton>
                </section>
            </div>
        )
    }
};

export default compose(
    pure,
    withRouter,
    withApollo,
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
)(ExperienceEdit);