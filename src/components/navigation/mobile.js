import React from 'react';
import { Grid, Button, Icon, Avatar, IconButton, Badge, Drawer, ListItem } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { NavLink, Link } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import { s3BucketURL } from '../../constants/s3';
import { cv30Logo, defaultUserAvatar } from '../../constants/utils';
import LanguageToggle from '../LanguageToggle'

const MobileNav = (props) => {

    const {
        localUserData: { loading: localUserLoading, localUser: { timestamp } },
        currentUser: { loading: currentUserLoading, auth },
        match: { params: { lang } }, doLogout,
        state: { mobileNavOpen, mobileNotificationIsOpen, notifications, mobileProfileIsOpen },
        toggleMobileNav, closeMobileNav,
        toggleMobileNotifications, closeMobileNotifications,
        toggleMobileProfile, closeMobileProfile
    } = props;

    if (localUserLoading || currentUserLoading)
        return <span>Loading...</span>

    const { currentUser } = auth || {};

    const userCompany = (currentUser && currentUser.ownedCompanies && currentUser.ownedCompanies.length > 0) ? currentUser.ownedCompanies[0] : null;

    const avatar =
        (!localUserLoading && currentUser && currentUser.avatarPath) ?
            `${s3BucketURL}${currentUser.avatarPath}?${timestamp}` : defaultUserAvatar;

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
                    <Avatar alt={(currentUser && currentUser.firstName) || (currentUser && currentUser.email)} src={avatar} className='avatar' />
                    <span>{(currentUser && currentUser.firstName) || (currentUser && currentUser.email)}</span>
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
                
                <LanguageToggle />
                {/* Drawers */}

                <Drawer anchor="right" open={mobileNavOpen} onClose={closeMobileNav} className='mobileNavContainer' classes={{ paperAnchorRight: 'sideDrawer' }}>
                    {console.log("*********************************************", mobileNavOpen)}
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
                            {currentUser && userCompany ?
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

                            {currentUser && userCompany ?
                                <React.Fragment>
                                    <FormattedMessage id="nav.companyProfile" defaultMessage="Company profile" description="Company profile">
                                        {(text) => (<ListItem button
                                            component={Link} to={`/${lang}/company/${userCompany.id}`}
                                            onClick={closeMobileProfile}>
                                            {text}
                                        </ListItem>
                                        )}
                                    </FormattedMessage>
                                    <FormattedMessage id="nav.jobs" defaultMessage="Jobs" description="Company jobs">
                                        {(text) => (<ListItem button
                                            component={Link} to={{
                                                pathname: `/${lang}/company/${userCompany.id}/settings`,
                                                state: { activeTab: 'jobs' }
                                            }}
                                            onClick={closeMobileProfile}>
                                            {text}
                                        </ListItem>
                                        )}
                                    </FormattedMessage>
                                    <FormattedMessage id="nav.companySettings" defaultMessage="Settings" description="Company settings">
                                        {(text) => (<ListItem button
                                            component={Link} to={{
                                                pathname: `/${lang}/company/${userCompany.id}/settings`,
                                                state: { activeTab: 'settings' }
                                            }}
                                            onClick={closeMobileProfile}>
                                            {text}
                                        </ListItem>
                                        )}
                                    </FormattedMessage>
                                </React.Fragment>
                                :
                                <FormattedMessage id="nav.noCompany" defaultMessage="Create Company" description="Create company">
                                    {(text) => (<Link
                                        to={{
                                            pathname: `/${lang}/companies/new`,
                                            state: { profile: currentUser.profile }
                                        }}
                                        onClick={closeMobileProfile}
                                        className='noCompanyLink'
                                    >
                                        {text}
                                    </Link>)}
                                </FormattedMessage>
                            }
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