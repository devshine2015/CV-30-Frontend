import React from 'react';
import { TextField, Checkbox, FormLabel, FormControlLabel, IconButton, Icon, Switch as ToggleSwitch, FormGroup, Button } from '@material-ui/core';
import { compose, pure } from 'recompose';
import { graphql, withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import uuid from 'uuid/v4';
import { DatePicker } from 'material-ui-pickers';
import moment from 'moment';
import Downshift from "downshift";
import * as yup from 'yup';
import { FormattedMessage } from 'react-intl'
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import deburr from "lodash/deburr";
import suggestions from '../../../../constants/locations';

import { setExperienceMutation, setProjectMutation, setFeedbackMessage, setHobbyMutation, setEducationMutation } from '../../../../store/queries';
import { currentProfileRefetch } from '../../../../store/refetch';
import ImageUploader from '../../../../components/imageUploader';
import EducationLevelInput from '../../../../components/EducationLevelInput';
import { s3BucketURL } from '../../../../constants/s3';

const debounce = (func, wait, immediate) => {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

class InputHOC extends React.PureComponent {
    state = {
        value: this.props.value || "",
        valid: true
    }
    validate = debounce(() => this.props.updateFormState([{
        field: this.props.name,
        value: this.state.value,
        valid: this.state.valid
    }]), 180)
    handleChange = async event => this.setState({
        value: event.target.value,
        valid: (this.props.schema && await this.props.schema.isValid(event.target.value))
    }, () => this.props.updateFormState ? this.validate() : {});
    render() {
        return (
            <TextField
                name={this.props.name}
                label={this.props.label}
                placeholder={this.props.placeholder}
                className='textField'
                fullWidth={this.props.fullWidth || false}
                multiline={this.props.multiline || false}
                rowsMax={this.props.rowsMax || 1}
                onChange={this.handleChange}
                value={this.state.value}
                error={!this.state.valid}
            />
        )
    }
}

class PeriodDatePickers extends React.PureComponent {
    state = {
        startDate: this.props.startDate || moment().subtract(1, 'days'),
        startDateValid: true,
        endDate: this.props.startDate || moment(),
        endDateValid: true,
        isCurrent: false
    }
    handleStartChange = async value => {
        this.setState({
            startDate: value,
            startDateValid: await this.props.startDateSchema.isValid(value)
        }, () => this.props.updateFormState([{
            field: 'startDate',
            value: this.state.startDate,
            valid: this.state.startDateValid
        }]))
    }
    handleEndChange = async value => {
        this.setState({
            endDate: value,
            endDateValid: this.state.isCurrent || value && await this.props.endDateSchema.isValid(value)
        }, () => this.props.updateFormState([{
            field: 'endDate',
            value: this.state.endDate,
            valid: this.state.endDateValid
        }]))
    }
    toggleCurrent = value => this.setState({
        isCurrent: !this.state.isCurrent,
        endDate: !this.state.isCurrent ? null : moment(),
        endDateValid: true
    }, () => this.props.updateFormState([{
        field: 'endDate',
        value: this.state.endDate,
        valid: this.state.endDateValid
    }, {
        field: 'isCurrent',
        value: this.state.isCurrent,
        valid: true
    }]))
    render() {
        return (
            <div className='datePickers'>
                <FormattedMessage id="users.date" defaultMessage="Date" description="Date">
                    { text => <p>{text}</p> }
                </FormattedMessage>
                <FormattedMessage id="users.startDate" defaultMessage="Start Date" description="Start Date">
                    { text => <DatePicker
                        label={text}
                        format="DD/MM/YYYY"
                        maxDate={this.state.endDate || new Date()}
                        value={this.state.startDate}
                        onChange={this.handleStartChange}
                        error={!this.state.startDateValid}
                        animateYearScrolling
                    /> }
                </FormattedMessage>
                <FormattedMessage id="users.endDate" defaultMessage="End Date" description="End Date">
                    { text => <DatePicker
                        label={text}
                        format="DD/MM/YYYY"
                        disabled={this.state.isCurrent || false}
                        disableFuture={true}
                        minDate={this.state.startDate || ''}
                        value={this.state.endDate}
                        onChange={this.handleEndChange}
                        error={!this.state.endDateValid}
                        animateYearScrolling
                    /> }
                </FormattedMessage>
                <FormControlLabel
                    control={
                        <Checkbox
                            name='isCurrent'
                            checked={this.state.isCurrent}
                            onChange={this.toggleCurrent}
                            color="primary"
                        />
                    }
                    label="Still work there"
                />
            </div>
        )
    }
}

class LocationHOC extends React.PureComponent {
    renderInput = inputProps => {
        const { InputProps, classes, ref, ...other } = inputProps;
      
        return (
            <TextField
                InputProps={{
                    inputRef: ref,
                    classes: {
                        root: classes.inputRoot,
                        input: classes.inputInput
                    },
                    ...InputProps
                }}
                {...other}
            />
        );
    }
    getSuggestions = (value) => {
        const inputValue = deburr(value.trim()).toLowerCase();
        const inputLength = inputValue.length;
        let count = 0;
      
        return inputLength === 0
            ? []
            : suggestions.filter(suggestion => {
                const keep = count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;
                if (keep) count += 1;
                return keep;
            });
    }
    renderSuggestion = ({ suggestion, index, itemProps, highlightedIndex, selectedItem }) => {
        const isHighlighted = highlightedIndex === index;
        const isSelected = (selectedItem || "").indexOf(suggestion.label) > -1;
        return (
            <MenuItem
                {...itemProps}
                key={suggestion.label}
                selected={isHighlighted}
                component="div"
                style={{
                    fontWeight: isSelected ? 500 : 400
                }}
            >
                { suggestion.label }
            </MenuItem>
        );
    }
    handleChange = value => this.props.updateFormState ? this.props.updateFormState([{
        field: this.props.name,
        value,
        valid: true
    }]) : null
    render() {
        return (
            <Downshift onChange={this.handleChange}>
            {({
                getInputProps,
                getItemProps,
                getMenuProps,
                highlightedIndex,
                inputValue,
                isOpen,
                selectedItem
            }) => (
                <div>
                    <FormattedMessage id="location.startTyping" defaultMessage="Start typing..." description="Start typing...">
                        { text => this.renderInput({
                            fullWidth: true,
                            classes: [],
                            InputProps: getInputProps({
                                placeholder: text.split("\n")[1]
                            }),
                            label: text.split("\n")[0],
                            placeholder: text.split("\n")[1]
                        }) }
                    </FormattedMessage>
                    <div {...getMenuProps()}>
                        { isOpen ? (
                            <Paper square>
                                { this.getSuggestions(inputValue).map((suggestion, index) =>
                                    this.renderSuggestion({
                                        suggestion,
                                        index,
                                        itemProps: getItemProps({ item: suggestion.label }),
                                        highlightedIndex,
                                        selectedItem
                                    })
                                ) }
                            </Paper>
                        ) : null }
                    </div>
                </div>
            )}
            </Downshift>
        );
    }
}

class Media extends React.PureComponent {
    state = {
        video: this.props.videos && this.props.videos.length ? this.props.videos[0].path : '',
        images: this.props.images || [],
        image: this.props.images && !!this.props.images.length ? { id: this.props.images[0].id, path: this.props.images[0].path, sourceType: this.props.type } : null,
        isVideoUrl: !((this.props.images && this.props.images.length) || false),
        imageUploadOpen: false
    }
    openImageUpload = () => this.setState({ imageUploadOpen: true })
    closeImageUpload = () => this.setState({ imageUploadOpen: false })
    removeImage = () => this.props.setFieldValue('images', [])
    handleChange = () => this.setState({ isVideoUrl: !this.state.isVideoUrl })
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
    render() {
        return (
            <React.Fragment>
                <FormGroup row className='mediaToggle'>
                    <FormattedMessage id="feed.mediaToggleLabel" defaultMessage="Upload visuals" description="Upload visuals">
                        { text => <span className='mediaToggleLabel'>{text}</span> }
                    </FormattedMessage>
                    <FormattedMessage id="feed.photo" defaultMessage="Photo" description="Photo">
                        { text => <FormLabel className={!this.state.isVideoUrl ? 'active' : ''}>{text}</FormLabel> }
                    </FormattedMessage>
                    <ToggleSwitch
                        name='isVideoUrl'
                        checked={this.state.isVideoUrl}
                        onChange={this.handleChange}
                        classes={{
                            switchBase: 'colorSwitchBase',
                            checked: 'colorChecked',
                            bar: 'colorBar',
                        }}
                        color="primary" />
                    <FormattedMessage id="feed.videoUrl" defaultMessage="Video Url" description="Video Url">
                        {(text) => (
                            <FormLabel className={this.state.isVideoUrl ? 'active' : ''}>{text}</FormLabel>
                        )}
                    </FormattedMessage>
                </FormGroup>
                { this.state.isVideoUrl ?
                    <FormattedMessage id="feed.addVideoUrl" defaultMessage="Add video URL \n Video URL..." description="Add video URL">
                        { text => <InputHOC key="video" fullWidth={true} value={this.state.video} name="video" label={text.split("\n")[0]} placeholder={text.split("\n")[2]} schema={yup.string().trim().max(255).url()} /> }
                    </FormattedMessage>
                :
                    <React.Fragment>
                        { this.state.image ?
                            <div className="imagePreview">
                                <img src={`${s3BucketURL}${this.state.image.path}`} className='previewImg' alt='' />
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
                            id={this.props.id || ''}
                            type={this.props.type}
                            open={this.state.imageUploadOpen}
                            onClose={this.closeImageUpload}
                            onError={this.handleError}
                            onSuccess={this.handleSuccess}
                            userId={this.props.userId}
                        />
                    </React.Fragment>
                }
            </React.Fragment>
        )
    }
}

class ExperienceEdit extends React.Component {
    state = {
        formData: {
            id: (this.props.job && this.props.job.id) || uuid(),
            company: (this.props.job && this.props.job.id) || "",
            position: (this.props.job && this.props.job.id) || "",
            location: (this.props.job && this.props.job.id) || "",
            startDate: (this.props.job && this.props.startDate) || moment().subtract(1, 'days'),
            endDate: (this.props.job && this.props.endDate) || moment().subtract(1, 'days'),
            isCurrent: (this.props.job && this.props.jobisCurrent) || false
        },
        fieldsValidity: {
            position: false,
            company: false,
            location: false,
            startDate: true
        },
        formStatus: {
            isValid: false
        }
    }
    handleSubmit = async () => {
        const { job: { videos: oldVideos } = {}, type, match, closeEditor, setFeedbackMessage, client } = this.props;
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
        console.log(match);
        // console.log({
        //     [type]: {
        //         id,
        //         location,
        //         title,
        //         description,
        //         position,
        //         company,
        //         startDate,
        //         endDate: isCurrent ? undefined : endDate,
        //         isCurrent,
        //         videos,
        //         images
        //     },
        //     language: match.params.lang
        // });
    }
        //         try {
        //             await client.mutate({
        //                 mutation : type === 'experience'? setExperienceMutation : type === 'project'? setProjectMutation : type === 'education'?  setEducationMutation : setHobbyMutation,
        //                 variables: {
        //                     [type]: {
        //                         id,
        //                         location,
        //                         title,
        //                         description,
        //                         position,
        //                         company,
        //                         startDate,
        //                         endDate: isCurrent ? undefined : endDate,
        //                         isCurrent,
        //                         videos,
        //                         images
        //                     },
        //                     language: match.params.lang
        //                 },
        //                 refetchQueries: [
        //                     currentProfileRefetch(match.params.lang)
        //                 ]
        //             });
        //             await setFeedbackMessage({
        //                 variables: {
        //                     status: 'success',
        //                     message: 'Changes saved successfully.'
        //                 }
        //             });
        //             closeEditor();
        //             } catch ({ graphQLErrors }) {
        //                 let formattedError = graphQLErrors && graphQLErrors[0].reduce((result, current) => {
        //                     result += "\n" + current.message;
        //                     return result;
        //                 }, '')
        //                 await setFeedbackMessage({
        //                     variables: {
        //                         status: 'error',
        //                         message: formattedError
        //                     }
        //                 });
        //         }
        //     }
    shouldComponentUpdate = (nextProps, nextState) => {
        return this.state.formStatus.isValid !== nextState.formStatus.isValid;
    }
    handleChange = values => {
        let isValid = this.state.formStatus.isValid;
        let formData = { ...this.state.formData };
        let fieldsValidity = { ...this.state.fieldsValidity };
        values.map(item => {
            formData[item.field] = item.value;
            fieldsValidity[item.field] = item.valid;
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
        const { id, company, position, location, startDate, endDate, isCurrent, description, videos, images } = this.state.formData; 
        return (
            <div className='experienceForm'>
                <h4>
                    { 'Add / Edit ' + type }
                </h4>
                <section className='infoSection'>
                    {
                        type === "education" ? null
                        // <EducationLevelInput
                        //     value={position}
                        //     onChange={() => {}}
                        // />
                        :
                        <FormattedMessage id="users.addPositionField" defaultMessage="Add position\nPosition..." description="Position">
                            { text => <InputHOC key="position" updateFormState={this.handleChange} fullWidth={true} value={position} name="position" label={text.split("\n")[0]} placeholder={text.split("\n")[1]} schema={yup.string().max(255, 'Experience position cannot be longer than 255 chars').required()} /> }
                        </FormattedMessage>
                        
                    }
                    <FormattedMessage id="users.addCompanyField" defaultMessage="Add institution\nAdd company\nCompany..." description="Company">
                        { text => <InputHOC key="company" updateFormState={this.handleChange} fullWidth={true} value={company} name="company" label={text.split("\n")[0]} placeholder={text.split("\n")[1]} schema={yup.string().required('Company cannot be null').max(255, 'Experience company cannot be longer than 255 chars')} /> }
                    </FormattedMessage>
                    <LocationHOC key="location" name="location" updateFormState={this.handleChange} />
                    <PeriodDatePickers updateFormState={this.handleChange} startDate={startDate} endDate={endDate} isCurrent={isCurrent} startDateSchema={yup.date().required('Please provide a start date.')} endDateSchema={yup.date()} />
                    <FormattedMessage id="users.addDescriptionField" defaultMessage="Add description\nDescription..." description="Description">
                        { text => <InputHOC key="description" updateFormState={this.handleChange} rowsMax={4} multiline={true} fullWidth={true} value={description} name="description" label={text.split("\n")[0]} placeholder={text.split("\n")[1]} schema={yup.string().nullable()} /> }
                    </FormattedMessage>
                    <Media updateFormState={this.handleChange} type={type} userId={userId} videos={videos} images={images} />
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
    // withFormik({
    //     mapPropsToValues: ({
    //         job: { id, company, position = '', location = '', startDate = null, endDate = null, isCurrent = false, description = '', videos = [], images = [] } = {}
    //     }) => ({ 
            // id: id || uuid(),
            // company,
            // position,
            // location,
            // startDate: startDate || moment().subtract(1, 'days'),
            // endDate: endDate || moment().subtract(1, 'days'),
            // isCurrent,
            // description,
            // video: videos.length ? videos[0].path : '',
            // images,
            // isVideoUrl: !((images && images.length) || false)
        // }),
    //     validationSchema: yup.object().shape({
    //         location: yup.string().trim().max(255).required('Please enter a location'),
    //         images: yup.array().of(yup.object().shape({
    //             id: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
    //             title: yup.string().trim().max(255),
    //             description: yup.string().trim(),
    //             isFeatured: yup.boolean(),
    //             source: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
    //             sourceType: yup.string().matches(/(article|profile|profile_cover|company|company_cover|job|team|experience|project)/, { excludeEmptyString: true }),
    //             path: yup.string().trim().max(255)
    //         }))
    //     }),
    //     handleSubmit: async (values, { props: { job: { videos: oldVideos } = {}, type, match, closeEditor, setFeedbackMessage, client }, setSubmitting }) => {
    //         let { id, title, description, position, company, startDate, endDate, isCurrent, images, video, location } = values;
    //         const videos = []; //, images = [];
    //         let videoId = null;
    //         if (video) {
    //             if (oldVideos && oldVideos.length) videoId = oldVideos[0].id;
    //             videos.push({
    //                 id: videoId || uuid(),
    //                 source: id,
    //                 path: video || '',
    //                 sourceType: type
    //             });
    //         }
           
            
    //         try {
    //             await client.mutate({
    //                 mutation : type === 'experience'? setExperienceMutation : type === 'project'? setProjectMutation : type === 'education'?  setEducationMutation : setHobbyMutation,
    //                 variables: {
    //                     [type]: {
    //                         id,
    //                         location,
    //                         title,
    //                         description,
    //                         position,
    //                         company,
    //                         startDate,
    //                         endDate: isCurrent ? undefined : endDate,
    //                         isCurrent,
    //                         videos,
    //                         images
    //                     },
    //                     language: match.params.lang
    //                 },
    //                 refetchQueries: [
    //                     currentProfileRefetch(match.params.lang)
    //                 ]
    //             });
    //             await setFeedbackMessage({
    //                 variables: {
    //                     status: 'success',
    //                     message: 'Changes saved successfully.'
    //                 }
    //             });
    //             closeEditor();
    //             } catch ({ graphQLErrors }) {
    //                 let formattedError = graphQLErrors && graphQLErrors[0].reduce((result, current) => {
    //                     result += "\n" + current.message;
    //                     return result;
    //                 }, '')
    //                 await setFeedbackMessage({
    //                     variables: {
    //                         status: 'error',
    //                         message: formattedError
    //                     }
    //                 });
    //         }
    //     },
    //     displayName: 'ExperienceForm'
    // })
)(ExperienceEdit);