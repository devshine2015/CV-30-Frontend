import React from 'react';
import { TextField, Checkbox, FormLabel, FormControlLabel, IconButton, Icon, Switch as ToggleSwitch, FormGroup, Button } from '@material-ui/core';
import uuid from 'uuid/v4';
import { DatePicker } from 'material-ui-pickers';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import deburr from "lodash/deburr";
import Downshift from "downshift";

import ImageUploader from './imageUploader';
// import EducationLevelInput from './EducationLevelInput';
import { s3BucketURL } from '../constants/s3';

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

export class InputHOC extends React.PureComponent {
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

export class PeriodDatePickers extends React.PureComponent {
    state = {
        startDate: this.props.startDate || moment().subtract(1, 'days'),
        startDateValid: true,
        endDate: this.props.isCurrent ? null : this.props.endDate || moment(),
        endDateValid: true,
        isCurrent: this.props.isCurrent
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
            endDateValid: this.state.isCurrent || (value && await this.props.endDateSchema.isValid(value))
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

export class AutoSuggestField extends React.PureComponent {
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
            : this.props.suggestions.filter(suggestion => {
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
        value: this.props.suggestions.find(item => item.label === value).value,
        valid: true
    }]) : null
    render() {
        const valueItem = this.props.suggestions.find(item => item.value === this.props.value);
        return (
            <div className={this.props.className}>
                <Downshift onChange={this.handleChange} defaultSelectedItem={valueItem && valueItem.label}>
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
                        <FormattedMessage id={this.props.i18nId} defaultMessage="\nStart typing..." description="Start typing...">
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
            </div>
        );
    }
}

export class Media extends React.PureComponent {
    state = {
        video: this.props.video || '',
        images: this.props.images || [],
        image: this.props.images && !!this.props.images.length ? { id: this.props.images[0].id, path: this.props.images[0].path, sourceType: this.props.type } : null,
        isVideoUrl: !((this.props.images && this.props.images.length) || false),
        imageUploadOpen: false
    }
    openImageUpload = () => this.setState({ imageUploadOpen: true })
    closeImageUpload = () => this.setState({ imageUploadOpen: false })
    removeImage = () => this.setState({ images: [], image: null }, () => this.props.updateFormState ? this.props.updateFormState([{
        field: "images",
        value: this.state.images,
        valid: true
    }]) : null)
    handleVideoChange = response => this.setState({ video: (response && response[0] && response[0].value) || "" }, () => this.props.updateFormState ? this.props.updateFormState(response) : null)
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
        const { sourceId } = this.props;
        let image = {
            id: uuid(),
            sourceType: this.props.type,
            source: sourceId, //article id
            path: path ? path : `/profiles/${this.props.userId}/${this.props.type}/${filename}`
        };
        this.setState({
            images: this.state.images.concat([image]),
            image
        }, () => this.props.updateFormState ? this.props.updateFormState([{
            field: "images",
            value: this.state.images,
            valid: true
        }]) : null);
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
                        { text => <InputHOC key="video" updateFormState={this.handleVideoChange} fullWidth={true} value={this.state.video} name="video" label={text.split("\n")[0]} placeholder={text.split("\n")[2]} schema={this.props.videoSchema} /> }
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