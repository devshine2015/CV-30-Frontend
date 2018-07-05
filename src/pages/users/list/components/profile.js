import React from 'react';
import { compose, withState, withHandlers, pure } from 'recompose';
import { Avatar, Chip, Tabs, Tab } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { s3BucketURL, profilesFolder } from '../../../../constants/s3';

const ProfileHOC = compose(withState('activeTab', 'setActiveTab', false),
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

    let { id, firstName, lastName, email, hasAvatar, skills, values, aboutMeArticles } = user;
    let avatar = hasAvatar ? `${s3BucketURL}/${profilesFolder}/${id}/avatar.png` : '';
    let fullName = (firstName && lastName) ? `${firstName} ${lastName}` : email;

    return (
        <div className='listItem userListItem'>
            <div className='leftOverlay'>
                <Link to={`/dashboard/profile/${id}`}>
                    <Avatar alt={firstName || lastName || email} src={avatar} className='avatar' />
                </Link>
                <div className='leftOverlayTexts'>
                    <h6 className='userName'>
                        <span>{fullName}</span>
                        <i className='fas fa-caret-down' />
                    </h6>
                    <p className='userTitle'>Manager</p>
                </div>
            </div>
            <div className='rightOverlay'>
                Works at&nbsp;<span className='highlight'>CV30</span>&nbsp;-&nbsp;<span className='highlight'>Marketing team</span>
            </div>
            <div className='itemBody'>
                <div className='chipContainer'>
                    <span className='chipTitle skills'>Hard skills:</span>
                    {(skills && skills.length > 0) ?
                        skills.map(item => <Chip label={item.i18n[0].title} key={item.id} className='chip' />)
                        : <span className='empty'>No skills.</span>
                    }
                </div>

                <div className='chipContainer'>
                    <span className='chipTitle values'>Soft skills & values:</span>
                    {(values && values.length > 0) ?
                        values.map(item => <Chip label={item.i18n[0].title} key={item.id} className='chip' />)
                        : <span className='empty'>No values.</span>
                    }
                </div>
                {
                    (aboutMeArticles && aboutMeArticles.length > 0) ?
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            classes={{
                                root: 'tabsContainer',
                                indicator: 'tabsIndicator'
                            }}
                        >
                            <Tab
                                label="More about me"
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

export default ProfileHOC(Profile);