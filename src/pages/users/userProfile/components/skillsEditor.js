import React from 'react';
import { Popover, Button, FormControl, InputLabel, Input, InputAdornment, IconButton, Icon, Chip } from '@material-ui/core';
import { compose, pure, withState, withHandlers, lifecycle } from 'recompose';

const SkillsEdit = (props) => {
    const { displaySkills, skillsAnchor, closeSkillsModal, updateSkills, newSkill, updateNewSkill, addSkill, removeChip } = props;
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
            // disableBackdropClick={true}
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
                    (displaySkills && displaySkills.length) &&
                    displaySkills.map((skill, index) =>
                        <Chip
                            label={skill}
                            className='chip'
                            key={`value-${index}`}
                            onDelete={() => removeChip(index)}
                            classes={{ deleteIcon: 'deleteIcon' }}
                        />
                    )
                }

            </div>
            <div className='popupFooter'>
                <IconButton className='footerCheck' onClick={closeSkillsModal}>
                    <Icon>done</Icon>
                </IconButton>
            </div>
        </Popover>
    );
}

const SkillsEditHOC = compose(
    withState('displaySkills', 'setDisplaySkills', ({ skillsModalData }) => (skillsModalData || [])),
    withState('newSkill', 'setSkillText', ''),
    withHandlers({
        updateNewSkill: ({ setSkillText }) => (skill) => {
            setSkillText(skill);
        },
        addSkill: ({ newSkill, displaySkills, setSkillText }) => () => {
            displaySkills.push(newSkill);
            setSkillText('');
        },
        removeChip: ({ displaySkills, setDisplaySkills }) => (chipIndex) => {
            const chipData = [...displaySkills];
            chipData.splice(chipIndex, 1);
            setDisplaySkills(chipData);
        }
    }),
    pure
);

export default SkillsEditHOC(SkillsEdit);