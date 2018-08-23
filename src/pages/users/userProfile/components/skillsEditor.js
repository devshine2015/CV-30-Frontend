import React from 'react';
import { Popover, FormControl, IconButton, Icon } from '@material-ui/core';
import { compose, pure, withState, withHandlers } from 'recompose';
import { setSkills, setValues, profileQuery, setFeedbackMessage } from '../../../../store/queries';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import TagsInput from '../../../../components/TagsInput';

const SkillsEditHOC = compose(
    withRouter,
    graphql(setSkills, { name: 'setSkills' }),
    graphql(setValues, { name: 'setValues' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('initialSkills', '', ({ skillsModalData }) => {
        if (skillsModalData && skillsModalData.data) {
            return skillsModalData.data.map(item => item.i18n[0].title);
        }
        return [];
    }),
    withState('tagsInputSkills', 'setTagsInputSkills', ({ skillsModalData }) => {
        if (skillsModalData && skillsModalData.data) {
            return skillsModalData.data.map(item => item.i18n[0].title);
        }
        return [];
    }),
    withState('maxSkillCount', '', 25),
    withHandlers({
        updateTagsInputSkills: ({ setTagsInputSkills, setFeedbackMessage, maxSkillCount }) => (skills) => {
            if (skills.length > maxSkillCount) {
                setFeedbackMessage({
                    variables: {
                        status: 'error',
                        message: `Reached limit.`
                    }
                });
                return;
            }
            setTagsInputSkills(skills);
        },
        saveData: ({ setFeedbackMessage, skillsModalData, initialSkills, tagsInputSkills, setSkills, setValues, closeSkillsModal, match }) => async () => {
            const { type } = skillsModalData;

            // Diff current with initial
            const toAdd = tagsInputSkills.filter(item => initialSkills.findIndex(el => el === item) === -1);
            const toRemove = initialSkills.filter(item => tagsInputSkills.findIndex(el => el === item) === -1);

            switch (type) {
                case 'skills':
                    try {
                        await setSkills({
                            variables: {
                                language: match.params.lang,
                                addSkills: toAdd,
                                removeSkills: toRemove
                            },
                            refetchQueries: [{
                                query: profileQuery,
                                fetchPolicy: 'network-only',
                                name: 'currentProfileQuery',
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
                                language: match.params.lang,
                                addValues: toAdd,
                                removeValues: toRemove
                            },
                            refetchQueries: [{
                                query: profileQuery,
                                fetchPolicy: 'network-only',
                                name: 'currentProfileQuery',
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
        },
    }),
    pure
);


const SkillsEdit = props => {
    const { maxSkillCount, skillsAnchor, closeSkillsModal, tagsInputSkills, updateTagsInputSkills, saveData, skillsModalData } = props;
    const { type } = skillsModalData || {};
    const typeText = type;
    const capitalTypeText = (type === 'values') ? "Values" : "Skills";

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
                    <FormattedMessage id={`userProfile.add${capitalTypeText}`} defaultMessage={`Add ${typeText}`} description={`User header add ${typeText}`}>
                        {(text) => <span className='title'>{text}</span>}
                    </FormattedMessage>

                    <TagsInput value={tagsInputSkills} onChange={updateTagsInputSkills} helpTagName={type} />

                    <FormattedMessage id={`userProfile.remaining${(type === 'values') ? "Values" : "Skills"}`} values={{ count: maxSkillCount - tagsInputSkills.length }}>
                        {(text) => <small className='helperText'>{text}</small>}
                    </FormattedMessage>
                </FormControl>
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