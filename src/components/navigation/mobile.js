import React from 'react';
import { Grid, Button, Icon, Avatar, IconButton, Badge, Drawer, ListItem } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { NavLink, Link } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import { s3BucketURL, profilesFolder } from '../../constants/s3';
import { cv30Logo, defaultUserAvatar } from '../../constants/utils';

const MobileNav = (props) => {

    const {
        localUserData: { loading: localUserLoading, localUser: { timestamp } },
        currentUser: { loading: currentUserLoading, auth },
        match: { params: { lang } }, doLogout,
        toggleMobileNav, mobileNavOpen, closeMobileNav,
        toggleMobileNotifications, mobileNotificationIsOpen, closeMobileNotifications, notifications,
        toggleMobileProfile, mobileProfileIsOpen, closeMobileProfile
    } = props;

    if (localUserLoading || currentUserLoading)
        return <span>Loading...</span>

    let { currentUser } = auth;

    let avatar =
        (!localUserLoading && currentUser.hasAvatar) ?
            `${s3BucketURL}/${profilesFolder}/${currentUser.id}/avatar.${currentUser.avatarContentType}?${timestamp}` :
            defaultUserAvatar;


    return (
        <React.Fragment>
            <Grid item>
                <NavLink className='brand' to={`/${lang}`}>
                    <Avatar src={cv30Logo} alt="logo" className='brandImg' imgProps={{ style: { objectFit: 'contain' } }} />
                </NavLink>
            </Grid>
            <Grid item className='mobileNavContainer' id="mobileMainNav">
                {/* Buttons */}
                <Button onClick={toggleMobileProfile} className='profileButton'>
                    <Avatar alt="Gabriel" src={avatar} className='avatar' />
                    <span>Gabriel</span>
                </Button>

                <IconButton onClick={toggleMobileNotifications} className='notificationsButton'>
                    {
                        notifications.length ?
                            <Badge badgeContent={notifications.length} color="secondary">
                                <Icon>notifications</Icon>
                            </Badge>
                            : <Icon>notifications</Icon>
                    }
                </IconButton>

                <IconButton onClick={toggleMobileNav} className='mobileNavButton'>
                    <MenuIcon />
                </IconButton>

                {/* Drawers */}

                <Drawer anchor="right" open={mobileNavOpen} onClose={closeMobileNav} className='mobileNavContainer' classes={{ paperAnchorRight: 'sideDrawer' }}>
                    <div tabIndex={0} role="button" onClick={closeMobileNav} onKeyDown={closeMobileNav} className='content'>
                        <FormattedMessage id="nav.newsFeed" defaultMessage="News feed" description="News feed menu item">
                            {(text) => (
                                <ListItem button component={NavLink} exact to={`/${lang}/news`} onClick={closeMobileNav} className='mobileNavItem'>
                                    <i className="fas fa-lg fa-newspaper"></i>
                                    {text}
                                </ListItem>
                            )}
                        </FormattedMessage>

                        <FormattedMessage id="nav.companies" defaultMessage="Companies" description="Companies menu item">
                            {(text) => (
                                <ListItem button component={NavLink} exact to={`/${lang}/companies`} onClick={closeMobileNav} className='mobileNavItem'>
                                    <i className="far fa-lg fa-building"></i>
                                    {text}
                                </ListItem>
                            )}
                        </FormattedMessage>

                        <FormattedMessage id="nav.people" defaultMessage="People" description="People menu item">
                            {(text) => (
                                <ListItem button component={NavLink} exact to={`/${lang}/people`} onClick={closeMobileNav} className='mobileNavItem'>
                                    <i className="fas fa-lg fa-users"></i>
                                    {text}
                                </ListItem>
                            )}
                        </FormattedMessage>

                        <FormattedMessage id="nav.jobs" defaultMessage="Jobs" description="Jobs menu item">
                            {(text) => (
                                <ListItem button component={NavLink} exact to={`/${lang}/jobs`} onClick={closeMobileNav} className='mobileNavItem'>
                                    <i className="fas fa-lg fa-book"></i>
                                    {text}
                                </ListItem>
                            )}
                        </FormattedMessage>
                    </div>
                </Drawer>

                <Drawer anchor="top" open={mobileNotificationIsOpen} onClose={closeMobileNotifications} className='mobileNotificationsContainer'>
                    {
                        notifications.length &&
                        <div tabIndex={0} role="button" onClick={closeMobileNotifications} onKeyDown={closeMobileNotifications} className='content'>
                            {notifications.map((notification, index) => (
                                <ListItem button component={Link} to='#' onClick={closeMobileNotifications} className='mobileNotificationButton' key={`notification-${index}`}>
                                    <Avatar src={notification.avatar} className='notificationAvatar' />
                                    <div className='notificationBody'>
                                        <p className='notificationMessage'>{notification.message}</p>
                                        <p className='notificationElapsed'>{notification.timeElapsed}</p>
                                    </div>
                                </ListItem>
                            ))}
                        </div>
                    }
                </Drawer>
                <Drawer anchor="left" open={mobileProfileIsOpen} onClose={closeMobileProfile} className='mobileProfileContainer' classes={{ paperAnchorLeft: 'sideDrawer' }}>
                    <div tabIndex={0} role="button" onClick={closeMobileProfile} onKeyDown={closeMobileProfile} className='content'>
                        <FormattedMessage id="nav.profile" defaultMessage="My profile" description="Profile menu item">
                            {(text) => (<ListItem button component={NavLink} exact to={`/${lang}/myProfile/`} onClick={closeMobileProfile} className='mobileNavItem'>{text}</ListItem>)}
                        </FormattedMessage>

                        <FormattedMessage id="nav.appliedJobs" defaultMessage="Applied Jobs" description="Applied jobs menu item">
                            {(text) => (<ListItem button component={Link} to={{
                                pathname: `/${lang}/myProfile/settings`,
                                state: { activeTab: 'jobs' }
                            }} onClick={closeMobileProfile} className='mobileNavItem'>{text}</ListItem>)}
                        </FormattedMessage>

                        <FormattedMessage id="nav.settings" defaultMessage="Settings" description="Settings menu item">
                            {(text) => (<ListItem button component={Link} to={{
                                pathname: `/${lang}/myProfile/settings`,
                                state: { activeTab: 'settings' }
                            }} onClick={closeMobileProfile} className='mobileNavItem'>{text}</ListItem>)}
                        </FormattedMessage>

                        <div className='companiesContainer'>
                            <FormattedMessage id="nav.companiesLabel" defaultMessage="My company" description="Settings menu item">
                                {(text) => (<span className='companiesContainerTitle'>{text}</span>)}
                            </FormattedMessage>


                            <FormattedMessage id="nav.companyProfile" defaultMessage="Company profile" description="Logout menu item">
                                {(text) => (<ListItem button onClick={closeMobileProfile} className='mobileNavItem'> {text}</ListItem>)}
                            </FormattedMessage>

                        </div>

                        <FormattedMessage id="nav.logout" defaultMessage="Logout" description="Logout menu item">
                            {(text) => (<ListItem button onClick={doLogout} className='mobileNavItem'>{text}</ListItem>)}
                        </FormattedMessage>
                    </div>
                </Drawer>
            </Grid>
        </React.Fragment>
    )
};

export default MobileNav;