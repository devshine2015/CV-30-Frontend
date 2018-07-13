import React from 'react';
import { Button, FormControl, InputLabel, Input, Popover, InputAdornment } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import uuid from 'uuidv4';

import { handleTeam, companyQuery } from '../../../../store/queries';

const AddTeamHOC = compose(
    graphql(handleTeam, { name: 'handleTeam' }),
    withState('newTeam', 'setTeamName', ''),
    withState('teamAnchor', 'setTeamAnchor', null),
    withHandlers({
        updateNewTeam: ({ setTeamName }) => team => {
            setTeamName(team);
        },
        openTeamModal: ({ setTeamAnchor }) => target => {
            setTeamAnchor(target);
        },
        closeTeamModal: ({ setTeamAnchor }) => () => {
            setTeamAnchor(null);
        },
        addTeam: ({ newTeam, match, handleTeam, history }) => async () => {
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
                    refetchQueries: [{
                        query: companyQuery,
                        fetchPolicy: 'network-only',
                        name: 'currentUser',
                        variables: {
                            language: 'en',
                            id: match.params.companyId
                        }
                    }]
                });
                const { error, status } = result;
                if (status || !error)
                    history.push({
                        pathname: `/${match.params.lang}/dashboard/team/${teamDetails.id}`,
                        state: { editMode: true }
                    });
                else
                    console.log(error);
            }
            catch (err) {
                console.log(err);
            }
        }

    }),
    pure
)

const AddTeam = props => {
    const { match, teamAnchor, closeTeamModal, newTeam, updateNewTeam, addTeam, openTeamModal } = props;
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