import React from 'react';
import { Grid, Button, Icon, MenuItem, Avatar, Portal, ClickAwayListener, MenuList, Collapse, Paper, IconButton, Badge } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { NavLink, Link } from 'react-router-dom';
import { Manager, Target, Popper } from 'react-popper';
import classNames from 'classnames';
import { compose, withState, withHandlers, pure } from 'recompose';

import { s3BucketURL } from '../../constants/s3';
import { cv30Logo, defaultUserAvatar } from '../../constants/utils';
import  LanguageToggle from '../LanguageToggle'

const DesktopNav = props => {
    const {
        localUserData: { loading: localUserLoading, localUser: { timestamp } },
        currentUser: { loading: currentUserLoading, auth },
        match: { params: { lang } },
        doLogout, state: { notifications }
    } = props;


    if (localUserLoading || currentUserLoading)
        return <span>Loading...</span>

    const { currentUser } = auth || {};

    return (
        <React.Fragment>
            <Grid item sm={1} xs={1} md={1}>
                <NavLink className='brand' to={`/${lang}`}>
                    <Avatar src={cv30Logo} alt="logo" className='brandImg' imgProps={{ style: { objectFit: 'contain' } }} />
                </NavLink>
            </Grid>
            <Grid item md={11} lg={11} className='mainNavContainer' id="mainNav">
                <FormattedMessage id="nav.newsFeed" defaultMessage="News feed" description="News feed menu item">
                    {(text) => (
                        <Button component={NavLink} to={`/${lang}/news`} className='navButton'>
                            <Icon className='homeIcon'>home</Icon>
                            {text}
                        </Button>
                    )}
                </FormattedMessage>

                <FormattedMessage id="nav.companies" defaultMessage="Companies" description="Companies menu item">
                    {(text) => (
                        <Button component={NavLink} to={`/${lang}/companies`} className='navButton'>
                            {text}
                        </Button>
                    )}
                </FormattedMessage>

                <FormattedMessage id="nav.people" defaultMessage="People" description="People menu item">
                    {(text) => (
                        <Button component={NavLink} to={`/${lang}/people`} className='navButton'>
                            {text}
                        </Button>
                    )}
                </FormattedMessage>

                <FormattedMessage id="nav.jobs" defaultMessage="Jobs" description="Jobs menu item">
                    {(text) => (
                        <Button component={NavLink} to={`/${lang}/jobs`} className='navButton'>
                            {text}
                        </Button>
                    )}
                </FormattedMessage>

                {/* Profile menu*/}
                <ProfileMenu currentUser={currentUser} lang={lang} doLogout={doLogout} timestamp={timestamp} />
                {/* {currentUser ?
                    
                } */}

                {/* Notifications */}
                { currentUser && <NotificationsMenu notifications={notifications} /> }
                {/* Languae Button */}
                <LanguageToggle />
            </Grid>
        </React.Fragment>
    );
};

class ProfileMenu extends React.PureComponent {
    state = {
        profileMenuOpen: false,
    }
    showProfileMenu = () => {
        if (this.props.profileMenuOpen) return;
        this.setState({ profileMenuOpen: true });
    }
    closeProfileMenu = () => this.setState({ profileMenuOpen: false });
    user = () => {
        const userCompany = (this.props.currentUser && this.props.currentUser.ownedCompanies && this.props.currentUser.ownedCompanies.length > 0) ? this.props.currentUser.ownedCompanies[0] : null;
        const avatar =
            (this.props.currentUser && this.props.currentUser.avatarPath)
            ? `${s3BucketURL}${this.props.currentUser.avatarPath}?${this.props.timestamp}`
            : defaultUserAvatar;
        return (
            <Manager>
                <Target>
                    <Button aria-owns={this.state.profileMenuOpen ? 'profileMenu' : null} aria-haspopup="true" onClick={this.showProfileMenu} className='profileButton'>
                        <Avatar alt={this.props.currentUser.firstName || this.props.currentUser.email} src={avatar} className='avatar' />
                        <span>{this.props.currentUser.firstName || this.props.currentUser.email}</span>
                    </Button>
                </Target>
                <Portal>
                    <Popper placement="bottom" eventsEnabled={this.state.profileMenuOpen} className={classNames('profileMenuContainer', { 'popperClose': !this.state.profileMenuOpen })}>
                        <ClickAwayListener onClickAway={this.closeProfileMenu}>
                            <Collapse in={this.state.profileMenuOpen} id="profileMenu">
                                <Paper className='profileMenu'>
                                    <MenuList role="menu">
                                        <FormattedMessage id="nav.profile" defaultMessage="My profile" description="Profile menu item">
                                            {(text) => (<MenuItem component={Link} to={`/${this.props.lang}/myProfile`} onClick={this.closeProfileMenu}>{text}</MenuItem>)}
                                        </FormattedMessage>

                                        <FormattedMessage id="nav.appliedJobs" defaultMessage="Applied Jobs" description="Applied jobs menu item">
                                            {(text) => (<MenuItem component={Link} to={{
                                                pathname: `/${this.props.lang}/myProfile/settings`,
                                                state: { activeTab: 'jobs' }
                                            }} onClick={this.closeProfileMenu}>{text}</MenuItem>)}
                                        </FormattedMessage>

                                        <FormattedMessage id="nav.settings" defaultMessage="Settings" description="Settings menu item">
                                            {(text) => (<MenuItem component={Link} to={{
                                                pathname: `/${this.props.lang}/myProfile/settings`,
                                                state: { activeTab: 'settings' }
                                            }} onClick={this.closeProfileMenu}>{text}</MenuItem>)}
                                        </FormattedMessage>

                                        <div className='companiesContainer'>
                                            {
                                                userCompany ?
                                                    <React.Fragment>
                                                        <FormattedMessage id="nav.companiesLabel" defaultMessage="My company" description="Settings menu item">
                                                            {(text) => (<span className='companiesContainerTitle'>{text}</span>)}
                                                        </FormattedMessage>
                                                        <h4 className='companyName'>{userCompany.name}</h4>
                                                    </React.Fragment>
                                                    :
                                                    <FormattedMessage id="nav.noCompaniesLabel" defaultMessage="No company" description="Settings menu item">
                                                        {(text) => (<span className='companiesContainerTitle'>{text}</span>)}
                                                    </FormattedMessage>
                                            }

                                            {userCompany ?
                                                <React.Fragment>
                                                    <FormattedMessage id="nav.companyProfile" defaultMessage="Company profile" description="Company profile">
                                                        {(text) => (<MenuItem
                                                            component={Link} to={`/${this.props.lang}/company/${userCompany.id}`}
                                                            onClick={this.closeProfileMenu}
                                                        >
                                                            {text}
                                                        </MenuItem>
                                                        )}
                                                    </FormattedMessage>
                                                    <FormattedMessage id="nav.jobs" defaultMessage="Jobs" description="Company jobs">
                                                        {(text) => (<MenuItem
                                                            component={Link} to={{
                                                                pathname: `/${this.props.lang}/company/${userCompany.id}/settings`,
                                                                state: { activeTab: 'jobs' }
                                                            }}
                                                            onClick={this.closeProfileMenu}
                                                        >
                                                            {text}
                                                        </MenuItem>
                                                        )}
                                                    </FormattedMessage>
                                                    <FormattedMessage id="nav.companySettings" defaultMessage="Settings" description="Company settings">
                                                        {(text) => (<MenuItem
                                                            component={Link} to={{
                                                                pathname: `/${this.props.lang}/company/${userCompany.id}/settings`,
                                                                state: { activeTab: 'settings' }
                                                            }}
                                                            onClick={this.closeProfileMenu}
                                                        >
                                                            {text}
                                                        </MenuItem>
                                                        )}
                                                    </FormattedMessage>
                                                </React.Fragment>
                                                :
                                                <FormattedMessage id="nav.noCompany" defaultMessage="Create Company" description="Create company">
                                                    {(text) => (<Link to={{
                                                        pathname: `/${this.props.lang}/companies/new`,
                                                        state: { profile: this.props.currentUser.profile }
                                                    }}
                                                        onClick={this.closeProfileMenu}
                                                        className='noCompanyLink'
                                                    >
                                                        {text}
                                                    </Link>)}
                                                </FormattedMessage>
                                            }
                                        </div>

                                        <FormattedMessage id="nav.logout" defaultMessage="Logout" description="Logout menu item">
                                            {(text) => (<MenuItem onClick={this.props.doLogout}>{text}</MenuItem>)}
                                        </FormattedMessage>

                                    </MenuList>
                                </Paper>
                            </Collapse>
                        </ClickAwayListener>
                    </Popper>
                </Portal>
            </Manager>
        );
    }
    guest = () => (
        <React.Fragment>
            <FormattedMessage id="actions.logIn" defaultMessage="Log in" description="Log in action">
                {(text) => (
                    <Button component={NavLink} to={`/${this.props.lang}/login`} variant="contained" type="button" className='loginButton'>
                        {text}
                    </Button>
                )}
            </FormattedMessage>

            <FormattedMessage id="actions.signUp" defaultMessage="Sign up" description="Sign up action">
                {(text) => (
                    <Button component={NavLink} to={`/${this.props.lang}/register`} variant="contained" color="primary" type="button" className='registerButton'>
                        {text}
                    </Button>
                )}
            </FormattedMessage>
        </React.Fragment>
    )
    render() {
        return this.props.currentUser ? this.user() : this.guest();        
    }
}

const NotificationsMenu = compose(
    withState('notificationsMenuOpen', 'setState', false),
    withHandlers({
        showMenu: ({ setState }) => () => setState(true),
        closeMenu: ({ setState }) => () => setState(false)
    }),
    pure
)(({ notificationsMenuOpen, showMenu, notifications, closeMenu }) => (
    <Manager>
        <Target>
            <IconButton aria-owns={notificationsMenuOpen ? 'notificationsMenu' : null} aria-haspopup="true" onClick={showMenu} className='notificationsButton'>
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
                <ClickAwayListener onClickAway={closeMenu}>
                    <Collapse in={notificationsMenuOpen} id="notificationsMenu">
                        <Paper className='notificationsMenu'>
                            {/* {notifications.length && */}
                                <MenuList role="menu">
                                    {notifications.map((notification, index) => (
                                        <MenuItem onClick={closeMenu} className='notificationItem' key={`notification-${index}`}>
                                            <Avatar src={notification.avatar} className='notificationAvatar' />
                                            <div className='notificationBody'>
                                                <p className='notificationMessage'>{notification.message}</p>
                                                <p className='notificationElapsed'>{notification.timeElapsed}</p>
                                            </div>
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            {/* } */}
                        </Paper>
                    </Collapse>
                </ClickAwayListener>
            </Popper>
        </Portal>
    </Manager>
));

export default DesktopNav;