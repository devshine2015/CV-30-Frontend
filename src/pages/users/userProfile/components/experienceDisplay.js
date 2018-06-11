import React from 'react';
import ExperienceEdit from './experienceEdit';
import { IconButton, Icon, Grid } from '@material-ui/core';
import { compose, pure, withState, withHandlers } from 'recompose';

const ExperienceDisplay = ({ job, globalEditMode, editItem, toggleEditItem, closeEditor }) => {
    if (!job) {
        return null;
    } else {

        if (editItem) {
            return <ExperienceEdit job={job} closeEditor={closeEditor} key={editItem} />
        } else {

            return (
                <div className='experienceItem'>
                    <span className='company'>At&nbsp;
                        <span className='highlight'>{job.company}</span>
                    </span>

                    <span className={globalEditMode ? 'durationLocation editable' : 'durationLocation'}>
                        <span className='period'>15.05.2007 - Prezent</span>
                        <span className='location'>{job.location}</span>
                    </span>
                    {
                        globalEditMode &&
                        <IconButton className='experienceItemEditBtn' onClick={toggleEditItem}>
                            <Icon>edit</Icon>
                        </IconButton>
                    }
                    <Grid container className='experienceGrid'>
                        <Grid item xs={7}>
                            <h4>{job.position}</h4>
                            <p>{job.description}</p>
                        </Grid>
                        <Grid item xs={4}>
                            <div className='media'>
                                <Icon className='playIcon'>
                                    play_circle_filled
                    </Icon>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            );
        }
    }
}

const ExperienceDisplayHOC = compose(
    withState('editItem', 'setEditItem', false),
    withHandlers({
        toggleEditItem: ({ setEditItem, editItem }) => () => {
            setEditItem(!editItem);
        },
        saveData: () => () => { },
        closeEditor: ({ setEditItem }) => () => {
            setEditItem(false);
        }
    }),
    pure
);


export default ExperienceDisplayHOC(ExperienceDisplay);