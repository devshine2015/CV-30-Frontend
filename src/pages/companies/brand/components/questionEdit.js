import React from 'react';
import { Icon, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, TextField, IconButton } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { handleFAQ, companyQuery } from '../../../../store/queries';

const QuestionEditHOC = compose(
    withRouter,
    graphql(handleFAQ, { name: 'handleFAQ' }),
    withState('formData', 'setFormData', ({ question }) => {
        if (question)
            return {
                id: question.id,
                question: question.i18n[0].question,
                answer: question.i18n[0].answer
            }
        else
            return {}
    }),

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
        cancel: props => () => {
            console.log('cancel!');
        },
        save: ({ formData, match, handleFAQ }) => async () => {
            let { id, question, answer } = formData;
            try {
                await handleFAQ({
                    variables: {
                        language: match.params.lang,
                        faq: {
                            id, question, answer,
                            companyId: match.params.companyId
                        }
                    },

                    refetchQueries: [{
                        query: companyQuery,
                        fetchPolicy: 'network-only',
                        name: 'companyQuery',
                        variables: {
                            language: match.params.lang,
                            id: match.params.companyId
                        }
                    }]
                });
            }
            catch (err) {
                console.log(err);
            }
        }
    }),
    pure
);

const QuestionEdit = props => {
    const { panelId, onChange, handleFormChange, formData, expanded, cancel, save } = props;
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
                    value={question || ''}
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
                    value={answer || ''}
                />
                <div className='actions'>
                    <IconButton className='cancelBtn' onClick={cancel}>
                        <Icon>cancel</Icon>
                    </IconButton>
                    <IconButton className='submitBtn' onClick={save}>
                        <Icon>done</Icon>
                    </IconButton>
                </div>


            </ExpansionPanelDetails>
        </ExpansionPanel>)
};

export default QuestionEditHOC(QuestionEdit);