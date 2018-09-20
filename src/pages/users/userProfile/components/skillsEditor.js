import React from 'react';
import { Popover, FormControl, IconButton, Icon } from '@material-ui/core';
import { compose, pure, withState, withHandlers } from 'recompose';
import { setSkills, setValues, setFeedbackMessage } from '../../../../store/queries';
import { currentProfileRefetch } from '../../../../store/refetch';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import TagsInput from '../../../../components/TagsInput';
import SkillsInput from '../../../../components/SkillsInput';

const SkillsEditHOC = compose(
    withRouter,
    graphql(setSkills, { name: 'setSkills' }),
    graphql(setValues, { name: 'setValues' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('state', 'setState', ({ skillsModalData }) => {
        let tagsInputSkills = [];
        if (skillsModalData && skillsModalData.data) {
            switch (skillsModalData.type) {
                case 'values':
                    tagsInputSkills = skillsModalData.data.map(item => item.title);
                    break;
                case 'skills':
                    tagsInputSkills = skillsModalData.data.map(item => item.id);
                    break;
                default:
                    break;
            }
        }
        return {
            maxSkillCount: 25,
            tagsInputSkills
        }
    }),
    withHandlers({
        updateTagsInputSkills: ({ state, setState, setFeedbackMessage }) => (tagsInputSkills) => {
            if (tagsInputSkills.length > state.maxSkillCount) {
                setFeedbackMessage({
                    variables: {
                        status: 'error',
                        message: `Reached limit.`
                    }
                });
                return;
            }
            setState({ ...state, tagsInputSkills });
        },
        saveData: ({ setFeedbackMessage, skillsModalData: { type }, state: { tagsInputSkills }, setSkills, setValues, closeSkillsModal, match }) => async () => {
            switch (type) {
                case 'skills':
                    try {
                        await setSkills({
                            variables: {
                                language: match.params.lang,
                                skills: tagsInputSkills
                            },
                            refetchQueries: [
                                currentProfileRefetch(match.params.lang)
                            ]
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
                                values: tagsInputSkills
                            },
                            refetchQueries: [
                                currentProfileRefetch(match.params.lang)
                            ]
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
    const { state: { tagsInputSkills, maxSkillCount }, skillsAnchor, closeSkillsModal, updateTagsInputSkills, saveData, skillsModalData } = props;
    let type = 'values';
    try {
        type = skillsModalData.type;
    } catch(error) {};
    
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
                    <FormattedMessage id={`userProfile.add${type === 'values' ? "Values" : "Skills"}`} defaultMessage={`Add ${type}`} description={`User header add ${type}`}>
                        {(text) => <span className='title'>{text}</span>}
                    </FormattedMessage>

                    { type === 'skills'
                        ? <SkillsInput value={tagsInputSkills} onChange={updateTagsInputSkills}/>
                        : <TagsInput value={tagsInputSkills} onChange={updateTagsInputSkills} helpTagName={type} />
                    }
                    <FormattedMessage id={`userProfile.remaining${(type === 'values') ? "Values" : "Skills"}`} values={{ count: maxSkillCount - tagsInputSkills.length }}>
                        {(text) => <small className='helperText'>{text}</small>}
                    </FormattedMessage>
                </FormControl>
            </div>
            <div className='popupFooter'>
                <IconButton
                    onClick={closeSkillsModal}
                    className='footerCancel'
                >
                    <Icon>close</Icon>
                </IconButton>
                <IconButton className='footerCheck' onClick={saveData}>
                    <Icon>done</Icon>
                </IconButton>
            </div>
        </Popover>
    );
};

export default SkillsEditHOC(SkillsEdit);