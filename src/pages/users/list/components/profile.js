import React from 'react';
import { compose, withState, withHandlers, pure } from 'recompose';
import { Avatar, Chip, Tabs, Tab } from '@material-ui/core';
import { Link, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { s3BucketURL } from '../../../../constants/s3';
import { defaultUserAvatar } from '../../../../constants/utils';

const ProfileHOC = compose(
    withRouter,
    withState('activeTab', 'setActiveTab', false),
    withHandlers({
        handleTabChange: ({ activeTab, setActiveTab }) => (event, value) => {
            setActiveTab(activeTab === value ? false : value);
        }
    }),
    pure);

const Article = props => {
    const { img, title } = props;
    const style = {
        background: `url(${img})`
    }
    return (
        <div className='article' style={style}>

            <span className='articleTitle'>{title}</span>
        </div>
    )
}
const Profile = props => {
    const { activeTab, handleTabChange, user } = props;

    let { id, firstName, lastName, email, position, avatarPath, skills, values, aboutMeArticles, currentPosition } = user;
    let avatar = avatarPath ? `${s3BucketURL}${avatarPath}` : defaultUserAvatar;
    let fullName = (firstName && lastName) ? `${firstName} ${lastName}` : email;
    
    return (
        <div className='listItem userListItem'>
            <div className='leftOverlay'>
                <Link to={`/${props.match.params.lang}/profile/${id}`}>
                    <Avatar alt={firstName || lastName || email} src={avatar} className='avatar' imgProps={{ style: { objectFit: 'contain' } }} style={{ backgroundColor: '#fff', margin: 3 }} />
                </Link>
                <Link to={`/${props.match.params.lang}/profile/${id}`} style={{ textDecoration: 'none' }}>
                    <div className='leftOverlayTexts'>
                        <h6 className='userName'>
                            <span>{fullName}</span>
                            <i className='fas fa-caret-down' />
                        </h6>
                        <p className='userTitle'>{position}</p>
                    </div>
                </Link>
            </div>
            { (currentPosition.experience || currentPosition.project) && 
            <div className='rightOverlay'>
                Works at&nbsp;<span className='highlight'>
                    { (currentPosition.experience && currentPosition.experience.company) || '' }
                    { (currentPosition.experience && currentPosition.experience.company && currentPosition.project && currentPosition.project.company && ' &amp; ') || '' }
                    { (currentPosition.project && currentPosition.project.company) || '' }</span>
            </div> }
            <div className='itemBody'>
                <div className='chipContainer'>
                    <span className='chipTitle skills'>Hard skills:</span>
                    {(skills && skills.length > 0) ?
                        skills.map(item =>
                            <FormattedMessage id={`skills.${item.key}`} defaultMessage={item.key} key={item.key}>
                                {text => <Chip label={text} className='chip' />}
                            </FormattedMessage>
                        ) :
                        <FormattedMessage id="users.noSkills" defaultMessage="No skills." description="No skills">
                            {(text) => (
                                <span className='empty'>{text}</span>
                            )}
                        </FormattedMessage> 
                        
                    }
                </div>

                <div className='chipContainer'>
                    <FormattedMessage id="users.softValues" defaultMessage="Soft skills & values:" description="Soft skills">
                        {(text) => (
                            <span className='chipTitle values'>{text}</span>
                        )}
                    </FormattedMessage>
                    
                    {(values && values.length > 0) ?
                        values.map(item => <Chip label={item.title} key={item.id} className='chip' />)
                        : 
                        <FormattedMessage id="users.noValues" defaultMessage="No values." description="No values.">
                            {(text) => (
                                <span className='empty'>{text}</span>
                            )}
                        </FormattedMessage>
                        
                    }
                </div>
                {
                    (aboutMeArticles && aboutMeArticles.length > 0) ?
                        <FormattedMessage id="users.moreAbout" defaultMessage="More about me" description="More about me">
                            {(text) => (
                                <Tabs
                                    value={activeTab}
                                    onChange={handleTabChange}
                                    classes={{
                                        root: 'tabsContainer',
                                        indicator: 'tabsIndicator'
                                    }}
                                >
                                    <Tab
                                        label={text}
                                        value='more'
                                        classes={{
                                            root: 'tabRoot',
                                            labelIcon: 'labelIcon',
                                            selected: 'tabSelected',
                                            wrapper: 'tabWrapper',
                                            labelContainer: 'labelContainer',
                                            label: 'label'
                                        }}
                                        disableRipple
                                        disableTouchRipple
                                        focusRipple
                                        disabled={!aboutMeArticles || aboutMeArticles.length === 0}
                                    />
                                </Tabs>
                            )}
                          </FormattedMessage>
                        : null
                }
            </div>
            {
                (aboutMeArticles && aboutMeArticles.length > 0) ?
                    <div className={activeTab ? 'itemFooter open' : 'itemFooter'}>
                        {activeTab === 'more' &&
                            <div className='articles'>
                                {aboutMeArticles.map(article => (<Article {...article} key={article.id} />))}
                            </div>
                        }
                    </div>
                    : null
            }
        </div>
    );
}

export const ProfileItem = ProfileHOC(Profile);