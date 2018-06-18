import React from 'react';
import { Icon, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, TextField } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';

const QuestionEdit = props => {
    const { panelId, onChange, handleFormChange, formData, expanded } = props;
    const { question, answer } = formData;
    return (
        <ExpansionPanel expanded={expanded === panelId} onChange={onChange(panelId)} classes={{
            root: 'qaPanelRoot'
        }}>
            <ExpansionPanelSummary expandIcon={<Icon>arrow_drop_down_circle</Icon>} classes={{
                root: 'qaPanelHeader',
                expandIcon: 'qaHeaderIcon',
                content: 'qaPanelHeaderContent'
            }}>
                <TextField
                    name="question"
                    label="Question"
                    placeholder="Question..."
                    fullWidth
                    className='textField'
                    onChange={handleFormChange}
                    value={question}
                />
            </ExpansionPanelSummary>
            <ExpansionPanelDetails classes={{ root: 'qaPanelDetailRoot' }}>
                <TextField
                    name="answer"
                    label="Answer"
                    placeholder="Answer..."
                    fullWidth
                    multiline
                    rowsMax={10}
                    className='textField'
                    onChange={handleFormChange}
                    value={answer}
                />
            </ExpansionPanelDetails>
        </ExpansionPanel>)
}

const QuestionEditHOC = compose(
    withState('formData', 'setFormData', ({ question }) => (question || {})),
    withState(),
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
    }),
    pure
);

export default QuestionEditHOC(QuestionEdit);

