import React from 'react';
import ExperienceEdit from './experienceEdit';
import { IconButton, Icon, Grid } from '@material-ui/core';
import { compose, pure, withState, withHandlers } from 'recompose';
import { FormattedDate, FormattedMessage } from 'react-intl';
import ReactPlayer from 'react-player';
import { s3BucketURL } from '../../../../constants/s3';

const ExperienceDisplay = ({ job, globalEditMode, editItem, toggleEditItem, closeEditor, type, userId }) => {
    if (!job) {
        return null;
    } else {

        if (editItem) {
            return <ExperienceEdit userId={userId} job={job} closeEditor={closeEditor} type={type} />
        } else {
            let image, video;
            if (job.images && job.images.length > 0) {
                image = `${s3BucketURL}${job.images[0].path}`;
                // image = job.images[0].path;
            }
            if (job.videos && job.videos.length > 0) {
                video = job.videos[0].path;
            }

            return (
                <div className='experienceItem'>
                    <FormattedMessage id="users.at" defaultMessage="At" description="At">
                        {(text) => (
                            <span className='company'>{text}&nbsp;
                                <span className='highlight'>{job.company}</span>
                            </span>
                        )}
                    </FormattedMessage>
                    

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
                            <p>{job.description}</p>
                        </Grid>
                        <Grid item xs={4}>
                            <div className='media'>
                                {image &&
                                    <img src={image} alt={job.id} className='articleImg' />
                                }
                                {(video && !image) && <ReactPlayer
                                    url={video}
                                    width='100%'
                                    height='100%'
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
                                    playing={false} />}
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
        closeEditor: ({ setEditItem }) => () => {
            setEditItem(false);
        }
    }),
    pure
);


export default ExperienceDisplayHOC(ExperienceDisplay);