import React from 'react';
import { Popover, Button, FormControl, InputLabel, Input, InputAdornment, IconButton, Icon, Chip } from '@material-ui/core';
import { compose, pure, withState, withHandlers } from 'recompose';
import { setSkills, setValues, removeSkill, removeValue, currentProfileQuery, setFeedbackMessage } from '../../../../store/queries';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

const SkillsEditHOC = compose(
    withRouter,
    graphql(setSkills, { name: 'setSkills' }),
    graphql(setValues, { name: 'setValues' }),
    graphql(removeSkill, { name: 'removeSkill' }),
    graphql(removeValue, { name: 'removeValue' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('displaySkills', 'setDisplaySkills', ({ skillsModalData }) => {
        if (skillsModalData && skillsModalData.data) {
            let newArr = skillsModalData.data.map(item => ({
                id: item.id,
                title: item.i18n[0].title
            }));
            return newArr;
        }
        else return [];

    }),
    withState('newSkill', 'setSkillText', ''),
    withHandlers({
        updateNewSkill: ({ setSkillText }) => (skill) => {
            setSkillText(skill);
        },
        addSkill: ({ newSkill, displaySkills, setSkillText, setFeedbackMessage }) => () => {
            let arr = newSkill.split(',');
            arr.forEach(skill => {
                if (displaySkills.length >= 25) {
                    setFeedbackMessage({
                        variables: {
                            status: 'error',
                            message: `Reached limit.`
                        }
                    });
                    return;
                }
                let found = displaySkills.find(item => item.title.toLowerCase() === skill.trim().toLowerCase());

                if (found) {
                    setFeedbackMessage({
                        variables: {
                            status: 'error',
                            message: `Duplicate found: ${skill}`
                        }
                    });
                } else {
                    displaySkills.push({
                        id: null,
                        title: skill
                    });
                }
            })
            setSkillText('');
        },
        removeChip: ({ setFeedbackMessage, displaySkills, setDisplaySkills, skillsModalData, removeSkill, removeValue, match }) => async chipIndex => {
            const { type } = skillsModalData;
            let id = displaySkills[chipIndex].id;

            switch (type) {
                case 'skills':
                    try {
                        await removeSkill({
                            variables: {
                                id
                            },
                            refetchQueries: [{
                                query: currentProfileQuery,
                                fetchPolicy: 'network-only',
                                name: 'currentUser',
                                variables: {
                                    language: match.params.lang
                                }
                            }]
                        });
                        await setFeedbackMessage({
                            variables: {
                                status: 'success',
                                message: 'Changes saved successfully.'
                            }
                        });
                    }
                    catch (err) {
                        console.log(err);
                        await setFeedbackMessage({
                            variables: {
                                status: 'error',
                                message: err.message
                            }
                        });
                    }
                    break;
                case 'values':
                    try {
                        await removeValue({
                            variables: {
                                id
                            },
                            refetchQueries: [{
                                query: currentProfileQuery,
                                fetchPolicy: 'network-only',
                                name: 'currentUser',
                                variables: {
                                    language: match.params.lang
                                }
                            }]
                        });
                        await setFeedbackMessage({
                            variables: {
                                status: 'success',
                                message: 'Changes saved successfully.'
                            }
                        });
                    }
                    catch (err) {
                        console.log(err);
                        await setFeedbackMessage({
                            variables: {
                                status: 'error',
                                message: err.message
                            }
                        });
                    }
                    break;
                default:
                    return false;
            }

            let chipData = [...displaySkills];
            chipData.splice(chipIndex, 1);
            setDisplaySkills(chipData);
        },
        saveData: ({ setFeedbackMessage, displaySkills, skillsModalData, setSkills, setValues, closeSkillsModal, match }) => async () => {
            const { type } = skillsModalData;
            let data = displaySkills.map(item => item.title);

            switch (type) {
                case 'skills':
                    try {
                        await setSkills({
                            variables: {
                                language: 'en',
                                skills: data
                            },
                            refetchQueries: [{
                                query: currentProfileQuery,
                                fetchPolicy: 'network-only',
                                name: 'currentUser',
                                variables: {
                                    language: match.params.lang
                                }
                            }]
                        });
                        await setFeedbackMessage({
                            variables: {
                                status: 'success',
                                message: 'Changes saved successfully.'
                            }
                        });
                    }
                    catch (err) {
                        console.log(err);
                        await setFeedbackMessage({
                            variables: {
                                status: 'error',
                                message: err.message
                            }
                        });
                    }
                    break;
                case 'values':
                    try {
                        await setValues({
                            variables: {
                                language: 'en',
                                values: data
                            },
                            refetchQueries: [{
                                query: currentProfileQuery,
                                fetchPolicy: 'network-only',
                                name: 'currentUser',
                                variables: {
                                    language: match.params.lang
                                }
                            }]
                        });
                        await setFeedbackMessage({
                            variables: {
                                status: 'success',
                                message: 'Changes saved successfully.'
                            }
                        });
                    }
                    catch (err) {
                        console.log(err);
                        await setFeedbackMessage({
                            variables: {
                                status: 'error',
                                message: err.message
                            }
                        });
                    }
                    break;
                default:
                    return false;
            }
            closeSkillsModal();
        }
    }),
    pure
);


const SkillsEdit = props => {
    const { displaySkills, skillsAnchor, closeSkillsModal, newSkill, updateNewSkill, addSkill, removeChip, saveData, skillsModalData } = props;
    const { type } = skillsModalData || {};
    return (
        <Popover
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={Boolean(skillsAnchor)}
            anchorEl={skillsAnchor}
            onClose={closeSkillsModal}
            classes={{
                paper: 'skillsEditPaper'
            }}
        >
            <div className='popupHeader'>
                <FormControl className='skillsInput' fullWidth={true}>
                    {(type === 'values') ?
                        <FormattedMessage id="userProfile.addValues" defaultMessage="Add values" description="User header add values">
                            {(text) => <InputLabel>{text}</InputLabel>}
                        </FormattedMessage> :
                        <FormattedMessage id="userProfile.addSkills" defaultMessage="Add skills" description="User header add skills">
                            {(text) => <InputLabel>{text}</InputLabel>}
                        </FormattedMessage>
                    }

                    <Input
                        id="newSkill"
                        type='text'
                        value={newSkill}
                        onChange={event => updateNewSkill(event.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                <Button color='primary' size='small' variant='raised' className='addSkillButton' onClick={addSkill} disabled={!newSkill}>Add</Button>
                            </InputAdornment>
                        }
                        fullWidth={true}
                    />

                    {(type === 'values') ?
                        <FormattedMessage id="userProfile.remainingValues" values={{ count: 25 - displaySkills.length }}>
                            {(text) => <small className='helperText'>{text}</small>}
                        </FormattedMessage> :
                        <FormattedMessage id="userProfile.remainingSkills" values={{ count: 25 - displaySkills.length }}>
                            {(text) => <small className='helperText'>{text}</small>}
                        </FormattedMessage>
                    }
                </FormControl>
            </div>
            <div className='popupBody'>
                {
                    (displaySkills && displaySkills.length) ?
                        displaySkills.map((item, index) =>
                            <Chip
                                label={item.title}
                                className='chip'
                                key={`value-${index}`}
                                onDelete={() => removeChip(index)}
                                classes={{ deleteIcon: 'deleteIcon' }}
                            />
                        )
                        :
                        <span className='noChips'>Nothing to show.</span>
                }

            </div>
            <div className='popupFooter'>
                <IconButton className='footerCheck' onClick={saveData}>
                    <Icon>done</Icon>
                </IconButton>
            </div>
        </Popover>
    );
};

export default SkillsEditHOC(SkillsEdit);