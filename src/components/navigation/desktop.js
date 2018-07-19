import React from 'react';
import { Grid, Button, Icon, MenuItem, Avatar, Portal, ClickAwayListener, MenuList, Collapse, Paper, IconButton, Badge } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { NavLink, Link } from 'react-router-dom';
import { Manager, Target, Popper } from 'react-popper';
import classNames from 'classnames';

import { s3BucketURL, profilesFolder } from '../../constants/s3';
import { cv30Logo, defaultUserAvatar } from '../../constants/utils';

const DesktopNav = props => {
    const {
        localUserData: { loading: localUserLoading, localUser: { timestamp } },
        currentUser: { auth: { currentUser } },
        match: { params: { lang } },
        doLogout, profileMenuOpen, toggleProfileMenu, closeProfileMenu, notificationsMenuOpen, toggleNotificationsMenu, closeNotificationsMenu, notifications
    } = props;

    if (!currentUser)
        return null;

    let avatar =
        (!localUserLoading && currentUser.hasAvatar) ? `${s3BucketURL}/${profilesFolder}/${currentUser.id}/avatar.${currentUser.avatarContentType}?${timestamp}` : defaultUserAvatar

    return (
        <React.Fragment>
            <Grid item sm={1} xs={1} md={1}>
                <NavLink className='brand' to={`/${lang}/dashboard`}>
                    <Avatar src={cv30Logo} alt="logo" className='brandImg' imgProps={{ style: { objectFit: 'contain' } }} />
                </NavLink>
            </Grid>
            <Grid item md={11} lg={11} className='mainNavContainer' id="mainNav">
                <FormattedMessage id="nav.newsFeed" defaultMessage="News feed" description="News feed menu item">
                    {(text) => (
                        <Button component={NavLink} to={`/${lang}/dashboard/news`} className='navButton'>
                            <Icon className='homeIcon'>home</Icon>
                            {text}
                        </Button>
                    )}
                </FormattedMessage>

                <FormattedMessage id="nav.companies" defaultMessage="Companies" description="Companies menu item">
                    {(text) => (
                        <Button component={NavLink} to={`/${lang}/dashboard/companies`} className='navButton'>
                            {text}
                        </Button>
                    )}
                </FormattedMessage>

                <FormattedMessage id="nav.people" defaultMessage="People" description="People menu item">
                    {(text) => (
                        <Button component={NavLink} to={`/${lang}/dashboard/people`} className='navButton'>
                            {text}
                        </Button>
                    )}
                </FormattedMessage>

                <FormattedMessage id="nav.jobs" defaultMessage="Jobs" description="Jobs menu item">
                    {(text) => (
                        <Button component={NavLink} to={`/${lang}/dashboard/jobs`} className='navButton'>
                            {text}
                        </Button>
                    )}
                </FormattedMessage>

                {/* Profile menu*/}
                <Manager>
                    <Target>
                        <Button aria-owns={profileMenuOpen ? 'profileMenu' : null} aria-haspopup="true" onClick={toggleProfileMenu} className='profileButton' ref={node => {
                            this.target1 = node;
                        }}>
                            <Avatar alt="Gabriel" src={avatar} className='avatar'>
                                {/* {!user.hasAvatar && user.email.slice(0, 1)} */}
                            </Avatar>
                            <span>{currentUser.firstName || currentUser.email}</span>
                        </Button>
                    </Target>
                    <Portal>
                        <Popper placement="bottom" eventsEnabled={profileMenuOpen} className={classNames('profileMenuContainer', { 'popperClose': !profileMenuOpen })}>
                            <ClickAwayListener onClickAway={closeProfileMenu}>
                                <Collapse in={profileMenuOpen} id="profileMenu">
                                    <Paper className='profileMenu'>
                                        <MenuList role="menu">
                                            <FormattedMessage id="nav.profile" defaultMessage="My profile" description="Profile menu item">
                                                {(text) => (<MenuItem component={Link} to={`/${lang}/dashboard/profile`} onClick={closeProfileMenu}>{text}</MenuItem>)}
                                            </FormattedMessage>

                                            <FormattedMessage id="nav.appliedJobs" defaultMessage="Applied Jobs" description="Applied jobs menu item">
                                                {(text) => (<MenuItem component={Link} to={{
                                                    pathname: `/${lang}/dashboard/profile/settings`,
                                                    state: { activeTab: 'jobs' }
                                                }} onClick={closeProfileMenu}>{text}</MenuItem>)}
                                            </FormattedMessage>

                                            <FormattedMessage id="nav.settings" defaultMessage="Settings" description="Settings menu item">
                                                {(text) => (<MenuItem component={Link} to={{
                                                    pathname: `/${lang}/dashboard/profile/settings`,
                                                    state: { activeTab: 'settings' }
                                                }} onClick={closeProfileMenu}>{text}</MenuItem>)}
                                            </FormattedMessage>

                                            <div className='companiesContainer'>
                                                <FormattedMessage id="nav.companiesLabel" defaultMessage="My company" description="Settings menu item">
                                                    {(text) => (<span className='companiesContainerTitle'>{text}</span>)}
                                                </FormattedMessage>

                                                {currentUser.company ?
                                                    <FormattedMessage id="nav.companyProfile" defaultMessage="Company profile" description="Company profile">
                                                        {(text) => (<MenuItem
                                                            component={Link} to={`/${lang}/dashboard/company/${currentUser.company.id}`}
                                                            onClick={closeProfileMenu}
                                                        >
                                                            {text}
                                                        </MenuItem>
                                                        )}
                                                    </FormattedMessage>
                                                    :
                                                    <FormattedMessage id="nav.noCompany" defaultMessage="Create Company" description="Create company">
                                                        {(text) => (<Link
                                                            to={{
                                                                pathname: `/${lang}/dashboard/companies/new`,
                                                                state: { profile: currentUser.profile }
                                                            }}
                                                            onClick={closeProfileMenu}
                                                            className='noCompanyLink'
                                                        >
                                                            {text}
                                                        </Link>)}
                                                    </FormattedMessage>
                                                }

                                            </div>

                                            <FormattedMessage id="nav.logout" defaultMessage="Logout" description="Logout menu item">
                                                {(text) => (<MenuItem onClick={doLogout}>{text}</MenuItem>)}
                                            </FormattedMessage>

                                        </MenuList>
                                    </Paper>
                                </Collapse>
                            </ClickAwayListener>
                        </Popper>
                    </Portal>
                </Manager>

                {/* Notifications */}
                <Manager>
                    <Target>
                        <IconButton aria-owns={notificationsMenuOpen ? 'notificationsMenu' : null} aria-haspopup="true" onClick={toggleNotificationsMenu} className='notificationsButton'>
                            {
                                notifications.length ?
                                    <Badge badgeContent={notifications.length} color="secondary">
                                        <Icon>notifications</Icon>
                                    </Badge>
                                    : <Icon>notifications</Icon>
                            }
                        </IconButton>
                    </Target>
                    <Portal>
                        <Popper placement="bottom" eventsEnabled={notificationsMenuOpen} className={classNames({ 'popperClose': !notificationsMenuOpen })}>
                            <ClickAwayListener onClickAway={closeNotificationsMenu}>
                                <Collapse in={notificationsMenuOpen} id="notificationsMenu">
                                    <Paper className='notificationsMenu'>
                                        {notifications.length &&
                                            <MenuList role="menu">
                                                {notifications.map((notification, index) => (
                                                    <MenuItem onClick={closeNotificationsMenu} className='notificationItem' key={`notification-${index}`}>
                                                        <Avatar src={notification.avatar} className='notificationAvatar' />
                                                        <div className='notificationBody'>
                                                            <p className='notificationMessage'>{notification.message}</p>
                                                            <p className='notificationElapsed'>{notification.timeElapsed}</p>
                                                        </div>
                                                    </MenuItem>
                                                ))}
                                            </MenuList>
                                        }
                                    </Paper>
                                </Collapse>
                            </ClickAwayListener>
                        </Popper>
                    </Portal>
                </Manager>
            </Grid>
        </React.Fragment>
    );
};

export default DesktopNav;