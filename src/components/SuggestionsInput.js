import React from 'react';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { TextField, Paper, MenuItem } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { compose, withState, withHandlers, pure } from 'recompose';

const renderInputComponent = (inputProps) => {
    const { name, label, inputRef = () => { }, ref, ...other } = inputProps;

    return (
        <TextField
            name={name}
            label={label}
            fullWidth
            InputProps={{
                inputRef: node => {
                    ref(node);
                    inputRef(node);
                }
            }}
            {...other}
        />
    );
}

const styles = theme => ({
    root: {
        height: 250,
        flexGrow: 1,
    },
    container: {
        position: 'relative',
    },
    suggestionsContainerOpen: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
    },
    suggestion: {
        display: 'block',
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
    divider: {
        height: theme.spacing.unit * 2,
    },
});

const SuggestionsInputHOC = compose(
    withState('allSuggestions', '', props => {
        return props.suggestions;
    }),
    withState('suggestions', 'setSuggestions', []),
    withHandlers({
        handleSuggestionsFetchRequested: ({ allSuggestions, setSuggestions, getSuggestionValue }) => ({ value }) => {
            const inputValue = value.trim().toLowerCase();
            const inputLength = inputValue.length;
            let count = 0;

            let filteredSuggestions = [];
            if (inputLength > 0) {
                filteredSuggestions = allSuggestions.filter(suggestion => {
                    const keep = count < 5 && getSuggestionValue(suggestion).toLowerCase().slice(0, inputLength) === inputValue;

                    if (keep) {
                        count += 1;
                    }

                    return keep;
                });
            }
            setSuggestions(filteredSuggestions);
        },

        handleSuggestionsClearRequested: ({ setSuggestions }) => () => {
            setSuggestions([]);
        },

        renderSuggestion: ({ getSuggestionValue }) => (suggestion, { query, isHighlighted }) => {
            const suggestionValue = getSuggestionValue(suggestion);
            const matches = match(suggestionValue, query);
            const parts = parse(suggestionValue, matches);

            return (
                <MenuItem selected={isHighlighted} component="div">
                    <div>
                        {parts.map((part, index) => {
                            return part.highlight ? (
                                <span key={String(index)} style={{ fontWeight: 500 }}>
                                    {part.text}
                                </span>
                            ) : (
                                    <strong key={String(index)} style={{ fontWeight: 300 }}>
                                        {part.text}
                                    </strong>
                                );
                        })}
                    </div>
                </MenuItem>
            )
        },
    }),
    withStyles(styles),
    pure
)

const SuggestionsInput = props => {
    const { name, label, classes, className, renderSuggestion, getSuggestionValue, error, helperText } = props;
    const autosuggestProps = {
        renderInputComponent,
        suggestions: props.suggestions,
        onSuggestionsFetchRequested: props.handleSuggestionsFetchRequested,
        onSuggestionsClearRequested: props.handleSuggestionsClearRequested,
        getSuggestionValue,
        renderSuggestion
    };

    return (
        <Autosuggest
            {...autosuggestProps}
            inputProps={{
                name,
                label,
                className,
                error,
                helperText,
                placeholder: props.placeholder,
                value: props.value,
                onChange: (e, { newValue }) => {
                    e = {
                        ...e,
                        currentTarget: {
                            ...e.currentTarget,
                            name,
                            value: newValue
                        },
                        target: {
                            ...e.target,
                            name,
                            value: newValue
                        }
                    };
                    props.onChange(e)
                },
            }}
            theme={{
                container: classes.container,
                suggestionsContainerOpen: classes.suggestionsContainerOpen,
                suggestionsList: classes.suggestionsList,
                suggestion: classes.suggestion,
            }}
            renderSuggestionsContainer={options => (
                <Paper {...options.containerProps} square>
                    {options.children}
                </Paper>
            )}
        />
    );
}

export default SuggestionsInputHOC(SuggestionsInput);