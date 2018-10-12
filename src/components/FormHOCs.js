import React from 'react';
import { TextField, Checkbox, FormLabel, FormControlLabel, IconButton, Icon, Switch as ToggleSwitch, FormGroup, Button, Select, Chip, Input, ListItemText } from '@material-ui/core';
import uuid from 'uuid/v4';
import { DatePicker } from 'material-ui-pickers';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import deburr from "lodash/deburr";
import Downshift from "downshift";
// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';
// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';
import FroalaEditor from 'react-froala-wysiwyg';
import DoneIcon from '@material-ui/icons/Done';

import ImageUploader from './imageUploader';
import { s3BucketURL } from '../constants/s3';
import BenefitsIcons from '../assets/benefits';
import { withHandlers } from 'recompose';

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

export class JobSalary extends React.PureComponent {
    state = {
        amountMin: (this.props.salary && this.props.salary.amountMin) || 0,
        amountMax: (this.props.salary && this.props.salary.amountMax) || 10000,
        currency: (this.props.salary && this.props.salary.currency) || 'eur',
        isPublic: (this.props.salary && this.props.salary.isPublic) || false
    }
    handleMinChange = event => this.setState({ amountMin: event.target.value })
    handleMaxChange = event => this.setState({ amountMax: event.target.value })
    handlePublicChange = () => this.setState({ isPublic: !this.state.isPublic })
    render() {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <TextField
                    id="salary-min"
                    placeholder="minimum"
                    value={this.state.amountMin}
                    onChange={this.handleMinChange}
                    type="number"
                    className={"textfield"}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        inputProps: {
                            min: 0,
                            max: this.state.amountMax
                        }
                    }}
                    style={{ marginTop: 0, marginBottom: 0 }}
                    margin="normal"
                />
                <TextField
                    id="salary-max"
                    placeholder="maximum"
                    value={this.state.amountMax}
                    onChange={this.handleMaxChange}
                    type="number"
                    className={"textfield"}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        inputProps: {
                            min: this.state.amountMin
                        }
                    }}
                    style={{ marginLeft: 10, marginTop: 0, marginBottom: 0 }}
                    margin="normal"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            style={{
                                color: '#397db9'
                            }}
                            name="salary.isPublic"
                            checked={this.state.isPublic}
                            onChange={this.handlePublicChange}
                            />
                    }
                    label="Public" />
            </div>
        );
    }
}

export class SelectHOC extends React.PureComponent {
    state = {
        value: this.props.value || "",
        valid: true
    }
    validate = debounce(() => this.props.updateFormState([{
        field: this.props.name,
        value: this.state.value,
        valid: this.state.valid
    }]), 1800)
    handleChange = async event => this.setState({
        value: event.target && event.target.value ? event.target.value : event,
        valid: (this.props.schema && await this.props.schema.isValid(event.target && event.target.value ? event.target.value : event))
    }, () => this.props.updateFormState ? this.validate() : {});
    render() {
        return (
            <Select
                multiple={this.props.multiple || false}
                value={this.state.value}
                onChange={this.handleChange}
                input={<Input name={this.props.name} fullWidth={true} />}
                renderValue={selected => (
                    <div className={this.props.className}>
                        {selected.map(id => {
                            let option = this.props.options.find(option => option.id === id);
                            if (option)
                                return (
                                    <FormattedMessage id={`benefits.${option.key}`} defaultMessage={option.key} key={option.key}>
                                        {(text) => <Chip label={text} className='chip' />}
                                    </FormattedMessage>
                                )
                            else
                                return null;
                        })}
                    </div>
                )}
                className='jobSelect'
            >
                {this.props.options.map(option => (
                    <MenuItem key={option.id} value={option.id}>
                        <Checkbox checked={this.state.value.indexOf(option.id) > -1} />
                        <img style={{ marginRight: '10px', width: '20px' }} src={this.props.optionIcons[option.key.replace(/\b-([a-z])/g, function(all, char) { return char.toUpperCase() })]} alt={option.key} />
                        <FormattedMessage id={`benefits.${option.key}`} defaultMessage={option.key}>
                            {(text) => <ListItemText primary={text} />}
                        </FormattedMessage>

                    </MenuItem>
                ))}
            </Select>
        )
    }
}

export class ChipsHOC extends React.PureComponent {
    state = {
        value: this.props.value ? this.props.value : this.props.multiple ? [] : null
    }
    select = value => this.setState({
        value: this.props.multiple ? this.state.value.concat([value]) : value
    }, () => console.log(this.state))
    remove = value => this.setState({
        value: [...this.state.value].filter(item => item != value)
    })
    render() {
        const languageKeys = {
            'jobBenefits': 'benefits',
            'skills': 'skills',
            'jobTypes': 'jobTypes'
        };
        return (
            <React.Fragment>
                { this.props.options.map(option => {
                    if (this.props.name === "jobTypes" || this.props.name === "status") return <ChipItem key={option.key || option.id} id={option.key || option.id} option={option} text={option.title} type={this.props.name} multiple={this.props.multiple} isSelected={this.state.value == option.id} useParentState={this.select} />
                    return <FormattedMessage key={option.key || option.id} id={`${languageKeys[this.props.name]}.${option.key}`} defaultMessage={option.key}>
                        { text => <ChipItem option={option} text={text} type={this.props.name} multiple={this.props.multiple} /> }
                    </FormattedMessage>;
                }) }
            </React.Fragment>
        )
    }
}

class ChipItem extends React.PureComponent {
    state = {
        selected: this.props.selected || false
    }
    toggle = () => {
        if (this.props.useParentState) {
            if (!this.props.isSelected) this.props.useParentState(this.props.id);
        } else this.setState({ selected: !this.state.selected })
    }
    icon = () => {
        this.icons = {
            jobBenefits: <BenefitsIcons icon={this.props.option.key} fill={this.state.selected ? '#397db9' : '#aaaaaa'} size={'1em'} style={{ margin: '0 -8px 0 4px' }} />
        }
        return this.props.type && this.icons[this.props.type] ? this.icons[this.props.type] : null;
    }
    render() {
        return (
            <Chip
                icon={this.icon()}
                label={this.props.text}
                onClick={this.props.isSelected || this.state.selected ? null : this.toggle}
                onDelete={this.props.multiple ? !this.state.selected ? null : this.toggle : this.props.isSelected ? this.toggle : null}
                style={{
                    alignSelf: 'flex-start',
                    marginBottom: 5,
                    marginRight: 5,
                    color: this.props.isSelected || this.state.selected ? '#397db9' : '#aaaaaa',
                    borderColor: this.props.isSelected || this.state.selected ? '#397db9' : '#aaaaaa',
                    fill: this.props.isSelected || this.state.selected ? '#397db9' : '#aaaaaa',
                    backgroundColor: '#ffffff'
                }}
                deleteIcon={!this.props.multiple ? this.props.isSelected ? <DoneIcon style={{ color: '#397db9' }} /> : null : <Icon style={{ color: this.props.isSelected || this.state.selected ? '#397db9' : '#aaaaaa' }}>close</Icon>}
                variant="outlined"
            />
        )
    }
}

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
        value: event.target && event.target.value ? event.target.value : event,
        valid: (this.props.schema && await this.props.schema.isValid(event.target && event.target.value ? event.target.value : event))
    }, () => this.props.updateFormState ? this.validate() : {});
    render() {
        return ( !this.props.froala ?
            !this.props.date ?
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
                    InputProps={this.props.inputProps || {}}
                />
                :
                <DatePicker
                    format="DD/MM/YYYY"
                    disablePast={true}
                    value={this.state.value}
                    animateYearScrolling
                    onChange={this.handleChange}
                />
            :
            <FroalaEditor
                config={{
                    placeholderText: this.props.placeholder,
                    iconsTemplate: 'font_awesome_5',
                    toolbarInline: true,
                    charCounterCount: false,
                    toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontFamily', 'fontSize', 'color', '-', 'paragraphFormat', 'align', 'formatOL', 'indent', 'outdent', '-', 'undo', 'redo']
                }}
                model={this.state.value}
                onModelChange={this.handleChange}
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
        console.log(inputProps);
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
                                    placeholder: text.split("\n")[1],
                                    ...this.props.InputProps
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