import React from 'react';
import { Popover, Button, FormControl, InputLabel, Input, InputAdornment, IconButton, Icon, Chip } from '@material-ui/core';
import { compose, pure, withState, withHandlers } from 'recompose';
import { setSkills, setValues, removeSkill, removeValue, currentUserQuery } from '../../../../store/queries';
import { graphql } from 'react-apollo';

const SkillsEditHOC = compose(
    graphql(setSkills, { name: 'setSkills' }),
    graphql(setValues, { name: 'setValues' }),
    graphql(removeSkill, { name: 'removeSkill' }),
    graphql(removeValue, { name: 'removeValue' }),
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
        addSkill: ({ newSkill, displaySkills, setSkillText }) => () => {
            let found = displaySkills.find(item => item.title.toLowerCase() === newSkill.toLowerCase());
            if (!found) {
                displaySkills.push({
                    id: null,
                    title: newSkill
                });
                setSkillText('');
            } else {
                alert('duplicate!');
            }
        },
        removeChip: ({ displaySkills, setDisplaySkills, skillsModalData, removeSkill, removeValue, match }) => async chipIndex => {
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
                                query: currentUserQuery,
                                fetchPolicy: 'network-only',
                                name: 'currentUser',
                                variables: {
                                    language: 'en',
                                    id: match.params.profileId
                                }
                            }]
                        });
                    }
                    catch (error) {
                        console.log(error);
                    }
                    break;
                case 'values':
                    try {
                        await removeValue({
                            variables: {
                                id
                            },
                            refetchQueries: [{
                                query: currentUserQuery,
                                fetchPolicy: 'network-only',
                                name: 'currentUser',
                                variables: {
                                    language: 'en',
                                    id: match.params.profileId
                                }
                            }]
                        });
                    }
                    catch (error) {
                        console.log(error);
                    }
                    break;
                default:
                    return false;
            }

            let chipData = [...displaySkills];
            chipData.splice(chipIndex, 1);
            setDisplaySkills(chipData);
        },
        saveData: ({ displaySkills, skillsModalData, setSkills, setValues, closeSkillsModal, match }) => async () => {
            const { type } = skillsModalData;
            console.log(displaySkills);
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
                                query: currentUserQuery,
                                fetchPolicy: 'network-only',
                                name: 'currentUser',
                                variables: {
                                    language: 'en',
                                    id: match.params.profileId
                                }
                            }]
                        });
                    }
                    catch (err) {
                        console.log(err);
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
                                query: currentUserQuery,
                                fetchPolicy: 'network-only',
                                name: 'currentUser',
                                variables: {
                                    language: 'en',
                                    id: match.params.profileId
                                }
                            }]
                        });
                    }
                    catch (err) {
                        console.log(err);
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


const SkillsEdit = (props) => {
    const { displaySkills, skillsAnchor, closeSkillsModal, newSkill, updateNewSkill, addSkill, removeChip, saveData } = props;
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
                    <InputLabel >Add values</InputLabel>
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
                    <small className='helperText'>*You can add 23 more skills.</small>
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