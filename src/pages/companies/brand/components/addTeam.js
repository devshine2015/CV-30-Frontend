import React from 'react';
import { Button, FormControl, InputLabel, Input, Popover, InputAdornment } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import uuid from 'uuidv4';

import { handleTeam, setFeedbackMessage } from '../../../../store/queries';
import { companyRefetch } from '../../../../store/refetch';

const AddTeamHOC = compose(
    graphql(handleTeam, { name: 'handleTeam' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('state', 'setState', {
        newTeam: '',
        teamAnchor: null
    }),
    withHandlers({
        updateNewTeam: ({ state, setState }) => newTeam => setState({
            ...state,
            newTeam
        }),
        openTeamModal: ({ state, setState }) => teamAnchor => setState({
            ...state,
            teamAnchor
        }),
        closeTeamModal: ({ state, setState }) => () => setState({
            ...state,
            teamAnchor: null
        }),
        addTeam: ({ state: { newTeam }, match, handleTeam, history, setFeedbackMessage }) => async () => {
            const teamDetails = {
                id: uuid(),
                name: newTeam,
                companyId: match.params.companyId
            };
            try {
                let result = await handleTeam({
                    variables: {
                        teamDetails
                    },
                    refetchQueries: [
                        companyRefetch(match.params.companyId, match.params.lang)
                    ]
                });
                const { error, status } = result;
                if (status || !error) {
                    history.push({
                        pathname: `/${match.params.lang}/team/${teamDetails.id}`,
                        state: { editMode: true }
                    });
                    await setFeedbackMessage({
                        variables: {
                            status: 'success',
                            message: 'Changes saved successfully.'
                        }
                    });
                }
                else {
                    console.log(error);
                    await setFeedbackMessage({
                        variables: {
                            status: 'error',
                            message: error || error.message
                        }
                    });
                }
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
        }

    }),
    pure
)

const AddTeam = props => {
    const { state: { teamAnchor, newTeam }, closeTeamModal, updateNewTeam, addTeam, openTeamModal } = props;
    return (
        <React.Fragment>
            <Button className='addTeamBtn' onClick={(event) => openTeamModal(event.target)}>Add Team</Button>
            <Popover
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(teamAnchor)}
                anchorEl={teamAnchor}
                onClose={closeTeamModal}
                classes={{
                    paper: 'addTeamPopUp'
                }}
            >
                <div className='popupHeader'>
                    <FormControl className='skillsInput' fullWidth={true}>
                        <InputLabel>Team name</InputLabel>
                        <Input
                            id="newTeam"
                            type='text'
                            value={newTeam}
                            onChange={event => updateNewTeam(event.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <Button color='primary' size='small' variant='raised' className='addSkillButton' onClick={addTeam} disabled={!newTeam}>Add</Button>
                                </InputAdornment>
                            }
                            fullWidth={true}
                        />

                    </FormControl>
                </div>
            </Popover>
        </React.Fragment>
    );
}

export default AddTeamHOC(AddTeam);