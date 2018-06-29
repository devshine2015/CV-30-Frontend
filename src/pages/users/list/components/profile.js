import React from 'react';
import { compose, withState, withHandlers, pure } from 'recompose';
import { Avatar, Chip, Tabs, Tab } from '@material-ui/core';
import { Link } from 'react-router-dom';

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
    const { activeTab, handleTabChange, featuredArticles, match } = props;
    return (
        <div className='listItem userListItem'>
            <div className='leftOverlay'>
                <Link to='/dashboard/profile'>
                    <Avatar alt="Gabriel" src="http://digitalspyuk.cdnds.net/17/25/980x490/landscape-1498216547-avatar-neytiri.jpg" className='avatar' />
                </Link>
                <div className='leftOverlayTexts'>
                    <h6 className='userName'>
                        Radu Daniel
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
                    <Chip label='Leadership' className='chip' />
                    <Chip label='Leadership' className='chip' />
                    <Chip label='Leadership' className='chip' />
                    <Chip label='Leadership' className='chip' />
                </div>
                <div className='chipContainer'>
                    <span className='chipTitle values'>Soft skills & values:</span>
                    <Chip label='Leadership' className='chip' />
                    <Chip label='Leadership' className='chip' />
                    <Chip label='Leadership' className='chip' />
                    <Chip label='Leadership' className='chip' />
                </div>
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
                    />
                </Tabs>
            </div>
            <div className={activeTab ? 'itemFooter open' : 'itemFooter'}>
                {activeTab === 'more' &&
                    <div className='articles'>
                        {featuredArticles.map((item, index) => (<Article {...item} key={`article-${index}`} />))}
                    </div>
                }
            </div>
        </div>
    );
}

export default ProfileHOC(Profile);