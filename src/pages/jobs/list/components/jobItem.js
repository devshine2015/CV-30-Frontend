import React from 'react';
import { Chip, IconButton, Icon } from '@material-ui/core';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { FormattedMessage } from 'react-intl';

import { stripHtmlTags } from '../../../../constants/utils';
import JobAvatarHeader from '../../../../components/AvatarHeader/JobAvatarHeader'
import { s3BucketURL } from '../../../../constants/s3';
import * as benefits from '../../../../assets/benefits';

const jobItem = props => {
    const { job, lang, editJob } = props;
    const { title, description, videoUrl, imagePath, appliedDate, jobTypes, jobBenefits, location } = job;

    return (
        <div className='listItem jobListItem'>
            <div className='leftOverlay'>
                <JobAvatarHeader job={job} lang={lang} />
            </div>
            <div className='rightOverlay'>
                <div className='location'>
                    <i className='fas fa-lg fa-map-marker-alt' />
                    {location}
                </div>
                {/*                
                <div className='match'>
                    <CircularProgress
                        variant='static'
                        size={80}
                        value={match || 0}
                        classes={{
                            root: 'matchRoot'
                        }}
                    />
                    <span className='matchValue'>
                        {match?match.toFixed(0):0}%
                        <br />
                        <span className='matchText'>
                            match
                        </span>
                    </span>
                </div>       
                */}
            </div>
            {
                appliedDate &&
                <span className='appliedDate'>Applied:&nbsp;<b>{appliedDate}</b></span>
            }
            <div className='itemBody'>
                {!!editJob &&
                    <IconButton className='editBtn' onClick={() => editJob(job.id)}>
                        <Icon>edit</Icon>
                    </IconButton>
                }
                {
                    (videoUrl || imagePath) &&
                    <div className='media'>
                        {imagePath &&
                            <img src={`${s3BucketURL}${imagePath}`} alt={title} className='jobImage' />
                        }
                        {(videoUrl && !imagePath) &&
                            <ReactPlayer
                                url={videoUrl}
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
                                playing={false} />
                        }
                    </div>
                }
                <div className='details'>
                    <h2 className='jobTitle'>{title}</h2>
                    <div className='levels'>
                        {jobTypes && jobTypes.map(item => <Chip className='jobLevel' label={item.title} key={item.id} />)}
                    </div>
                    <div className='benefits'>
                        {jobBenefits && jobBenefits.map(item => (
                            <FormattedMessage id={`benefits.${item.key}`} key={item.key}>
                                {(text) => (
                                    <div className='benefit' >
                                        <img style={{ marginRight: '10px', width: '20px' }} src={benefits[item.key.replace(/\b-([a-z])/g, function(all, char) { return char.toUpperCase() })]} alt={item.key} />
                                        {text}
                                    </div>
                                )}
                            </FormattedMessage>
                        ))}
                    </div>
                    <p className='companyDescription'>
                        {stripHtmlTags(description)}
                    </p>
                </div>

            </div>
        </div>
    );
};

export const JobItem = compose(withRouter)(jobItem);