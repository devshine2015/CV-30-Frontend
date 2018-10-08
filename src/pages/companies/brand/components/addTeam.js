import React from 'react';
import { Button, FormControl, InputLabel, Input, Popover, InputAdornment } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import uuid from 'uuidv4';
import { FormattedMessage } from 'react-intl'

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
            <FormattedMessage id="company.brand.addTeamBtn" defaultMessage="Add Team" description="Add Team">
                {(text) => (
                    <Button className='addTeamBtn' onClick={(event) => openTeamModal(event.target)}>{text}</Button>
                )}
            </FormattedMessage>
            
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
                    <FormattedMessage id="company.brand.teamName" defaultMessage="Team name" description="Team name">
                        {(text) => (
                            <InputLabel>{text}</InputLabel>
                        )}
                    </FormattedMessage>
                        
                        <Input
                            id="newTeam"
                            type='text'
                            value={newTeam}
                            onChange={event => updateNewTeam(event.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <FormattedMessage id="company.brand.add" defaultMessage="Add" description="Add">
                                        {(text) => (
                                            <Button color='primary' size='small' variant='contained' className='addSkillButton' onClick={addTeam} disabled={!newTeam}>{text}</Button>
                                        )}
                                    </FormattedMessage>
                                    
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