import React from 'react';
import classNames from 'classnames';
import Select from 'react-select';
import { withStyles } from '@material-ui/core/styles';
import { Typography,  TextField, MenuItem, Chip, Paper} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { emphasize } from '@material-ui/core/styles/colorManipulator';

const styles = theme => ({
    input: {
        display: 'flex',
        padding: 0,
    },
    valueContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flex: 1,
        alignItems: 'center',
    },
    chip: {
        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    },
    chipFocused: {
        backgroundColor: emphasize(
            theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
            0.08,
        ),
    },
    noOptionsMessage: {
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
    singleValue: {
        fontSize: 16,
    },
    placeholder: {
        position: 'absolute',
        left: 2,
        fontSize: 16,
    },
    paper: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
    },
});

const NoOptionsMessage = props => (
    <Typography
        color="textSecondary"
        className={props.selectProps.classes.noOptionsMessage}
        {...props.innerProps}
    >
        {props.children}
    </Typography>
);

const inputComponent = ({ inputRef, ...props }) => (
    <div ref={inputRef} {...props} />
);

const Control = props => (
    <TextField
        fullWidth
        InputProps={{
            inputComponent,
            inputProps: {
                className: props.selectProps.classes.input,
                inputRef: props.innerRef,
                children: props.children,
                ...props.innerProps,
            },
        }}
        {...props.selectProps.textFieldProps}
    />
);

const Option = props => (
    <MenuItem
        buttonRef={props.innerRef}
        selected={props.isFocused}
        component="div"
        style={{
            fontWeight: props.isSelected ? 500 : 400,
        }}
        {...props.innerProps}
    >
        {props.children}
    </MenuItem>
);

const Placeholder = props => (
    <Typography
        color="textSecondary"
        className={props.selectProps.classes.placeholder}
        {...props.innerProps}
    >
        {props.children}
    </Typography>
);

const SingleValue = props => (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
        {props.children}
    </Typography>
);

const ValueContainer = props => (
    <div className={props.selectProps.classes.valueContainer}>{props.children}</div>
);

const MultiValue = props => (
    <Chip
        tabIndex={-1}
        label={props.children}
        className={classNames(props.selectProps.classes.chip, {
            [props.selectProps.classes.chipFocused]: props.isFocused,
        })}
        onDelete={props.removeProps.onClick}
        deleteIcon={<CancelIcon {...props.removeProps} />}
    />
);

function Menu(props) {
    return (
        <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
            {props.children}
        </Paper>
    );
}

const components = {
    Control,
    Menu,
    MultiValue,
    NoOptionsMessage,
    Option,
    Placeholder,
    SingleValue,
    ValueContainer,
};

const IntegrationReactSelect = props => {
    const { classes, theme, suggestions, placeholder, onChange, value } = props;

    const selectStyles = {
        input: base => ({
            ...base,
            color: theme.palette.text.primary,
            '& input': {
                font: 'inherit',
            },
        }),
    };

    return (
        <Select
            classes={classes}
            styles={selectStyles}
            textFieldProps={{
            InputLabelProps: {
                shrink: true,
            },
            }}
            options={suggestions}
            components={components}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            isMulti
        />
    );
}

export default withStyles(styles, { withTheme: true })(IntegrationReactSelect);