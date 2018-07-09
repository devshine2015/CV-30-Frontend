import React from 'react';
import ExperienceEdit from './experienceEdit';
import { IconButton, Icon, Grid } from '@material-ui/core';
import { compose, pure, withState, withHandlers } from 'recompose';
import { FormattedDate, FormattedMessage } from 'react-intl';
import ReactPlayer from 'react-player';

const ExperienceDisplay = ({ job, globalEditMode, editItem, toggleEditItem, closeEditor, type }) => {
    if (!job) {
        return null;
    } else {

        if (editItem) {
            return <ExperienceEdit job={job} closeEditor={closeEditor} type={type} />
        } else {

            return (
                <div className='experienceItem'>
                    <span className='company'>At&nbsp;
                        <span className='highlight'>{job.company}</span>
                    </span>

                    <span className={globalEditMode ? 'durationLocation editable' : 'durationLocation'}>
                        <span className='period'>
                            <FormattedDate
                                value={job.startDate}
                                year='numeric'
                                month='2-digit'
                                day='2-digit'
                            >
                                {(text) => (<span>{text}</span>)}
                            </FormattedDate>
                            <span>&nbsp;-&nbsp;</span>
                            {
                                job.isCurrent ?
                                    <FormattedMessage id="present" defaultMessage="Present" description="Present">
                                        {(text) => (<span>{text}</span>)}
                                    </FormattedMessage>
                                    :
                                    <FormattedDate
                                        value={job.endDate}
                                        year='numeric'
                                        month='2-digit'
                                        day='2-digit'
                                    >
                                        {(text) => (<span>{text}</span>)}
                                    </FormattedDate>
                            }
                        </span>
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
                            <p>{(job.i18n && job.i18n.length === 1) ? job.i18n[0].description : ''}</p>
                        </Grid>
                        <Grid item xs={4}>
                            {/* <div className='media'> */}
                                {/* <Icon className='playIcon'>
                                    play_circle_filled
                                </Icon> */}
                                { job.videos && !!job.videos.length && <ReactPlayer
                                    url={job.videos[0].path}
                                    width='200'
                                    height='140'
                                    config={{
                                        youtube: {
                                            playerVars: {
                                                showinfo: 0,
                                                controls: 0,
                                                modestbranding: 1,
                                                loop: 1
                                            }
                                        }
                                    }}
                                    playing={false} /> }
                            {/* </div> */}
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