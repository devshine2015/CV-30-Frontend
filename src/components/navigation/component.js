import React from 'react';
import { Grid, Button, Hidden, Icon, MenuItem, Avatar, Portal, ClickAwayListener, MenuList, Collapse, Paper, IconButton, Badge, Drawer, ListItem } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { NavLink, Link } from 'react-router-dom';
import { Manager, Target, Popper } from 'react-popper';
import classNames from 'classnames';
import MenuIcon from '@material-ui/icons/Menu';

const Navigation = ({ match, classes, profileMenuOpen, toggleProfileMenu, closeProfileMenu, notificationsMenuOpen, toggleNotificationsMenu, closeNotificationsMenu, notifications, mobileNavOpen, toggleMobileNav, closeMobileNav }) => {
    const lang = match.params.lang;
    // debugger;
    return (
        <Grid container className={classes.root}>
            <Grid item sm={1} xs={1} md={1}>
                <NavLink className={classes.brand} to={`/${lang}/dashboard`}>
                    <img src="http://brandmark.io/logo-rank/random/pepsi.png" alt="logo" className={classes.brandImg} />
                </NavLink>
            </Grid>
            <Hidden smDown>
                <Grid item md={11} lg={11} className={classes.mainNavContainer} id="mainNav">
                    <FormattedMessage id="nav.newsFeed" defaultMessage="News feed" description="News feed menu item">
                        {(text) => (
                            <Button component={NavLink} to={`/${lang}/dashboard/news`} className={classes.navButton}>
                                <Icon className={classes.homeIcon}>home</Icon>
                                {text}
                            </Button>
                        )}
                    </FormattedMessage>

                    <FormattedMessage id="nav.companies" defaultMessage="Companies" description="Companies menu item">
                        {(text) => (
                            <Button component={NavLink} to={`/${lang}/dashboard/companies`} className={classes.navButton}>
                                {text}
                            </Button>
                        )}
                    </FormattedMessage>

                    <FormattedMessage id="nav.people" defaultMessage="People" description="People menu item">
                        {(text) => (
                            <Button component={NavLink} to={`/${lang}/dashboard/people`} className={classes.navButton}>
                                {text}
                            </Button>
                        )}
                    </FormattedMessage>

                    <FormattedMessage id="nav.jobs" defaultMessage="Jobs" description="Jobs menu item">
                        {(text) => (
                            <Button component={NavLink} to={`/${lang}/dashboard/jobs`} className={classes.navButton}>
                                {text}
                            </Button>
                        )}
                    </FormattedMessage>

                    {/* Profile menu*/}
                    <Manager>
                        <Target>
                            <Button aria-owns={profileMenuOpen ? 'profileMenu' : null} aria-haspopup="true" onClick={toggleProfileMenu} className={classes.profileButton}>
                                <Avatar alt="Gabriel" src="http://digitalspyuk.cdnds.net/17/25/980x490/landscape-1498216547-avatar-neytiri.jpg" className={classes.avatar} />
                                <span>Gabriel</span>
                            </Button>
                        </Target>
                        <Portal>
                            <Popper placement="bottom" eventsEnabled={profileMenuOpen} className={classNames(classes.profileMenuContainer, { [classes.popperClose]: !profileMenuOpen })}>
                                <ClickAwayListener onClickAway={closeProfileMenu}>
                                    <Collapse in={profileMenuOpen} id="profileMenu">
                                        <Paper className={classes.profileMenu}>
                                            <MenuList role="menu">
                                                <FormattedMessage id="nav.profile" defaultMessage="My profile" description="Profile menu item">
                                                    {(text) => (<MenuItem component={Link} to={`/${lang}/dashboard/profile`} onClick={closeProfileMenu}>{text}</MenuItem>)}
                                                </FormattedMessage>

                                                <FormattedMessage id="nav.appliedJobs" defaultMessage="Applied Jobs" description="Applied jobs menu item">
                                                    {(text) => (<MenuItem onClick={closeProfileMenu}>{text}</MenuItem>)}
                                                </FormattedMessage>

                                                <FormattedMessage id="nav.settings" defaultMessage="Settings" description="Settings menu item">
                                                    {(text) => (<MenuItem onClick={closeProfileMenu}>{text}</MenuItem>)}
                                                </FormattedMessage>

                                                <div className={classes.companiesContainer}>
                                                    <FormattedMessage id="nav.companiesLabel" defaultMessage="My company" description="Settings menu item">
                                                        {(text) => (<span className={classes.companiesContainerTitle}>{text}</span>)}
                                                    </FormattedMessage>


                                                    <FormattedMessage id="nav.companyProfile" defaultMessage="Company profile" description="Logout menu item">
                                                        {(text) => (<MenuItem onClick={closeProfileMenu}>{text}</MenuItem>)}
                                                    </FormattedMessage>

                                                </div>

                                                <FormattedMessage id="nav.logout" defaultMessage="Logout" description="Logout menu item">
                                                    {(text) => (<MenuItem onClick={closeProfileMenu}>{text}</MenuItem>)}
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
                            <IconButton aria-owns={notificationsMenuOpen ? 'notificationsMenu' : null} aria-haspopup="true" onClick={toggleNotificationsMenu} className={classes.notificationsButton}>
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
                            <Popper placement="bottom" eventsEnabled={notificationsMenuOpen} className={classNames({ [classes.popperClose]: !notificationsMenuOpen })}>
                                <ClickAwayListener onClickAway={closeNotificationsMenu}>
                                    <Collapse in={notificationsMenuOpen} id="notificationsMenu">
                                        <Paper className={classes.notificationsMenu}>
                                            {notifications.length &&
                                                <MenuList role="menu">
                                                    {notifications.map((notification, index) => (
                                                        <MenuItem onClick={closeNotificationsMenu} className={classes.notificationItem} key={`notification-${index}`}>
                                                            <Avatar src={notification.avatar} className={classes.notificationAvatar} />
                                                            <div className={classes.notificationBody}>
                                                                <p className={classes.notificationMessage}>{notification.message}</p>
                                                                <p className={classes.notificationElapsed}>{notification.timeElapsed}</p>
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
            </Hidden>

            <Hidden mdUp>
                <Grid item sm={11} xs={11} className={classes.mobileNavContainer} id="mobileMainNav">
                    {/* Profile menu*/}
                    <Manager>
                        <Target>
                            <Button aria-owns={profileMenuOpen ? 'profileMenu' : null} aria-haspopup="true" onClick={toggleProfileMenu} className={classes.profileButton}>
                                <Avatar alt="Gabriel" src="http://digitalspyuk.cdnds.net/17/25/980x490/landscape-1498216547-avatar-neytiri.jpg" className={classes.avatar} />
                                <span>Gabriel</span>
                            </Button>
                        </Target>
                        <Portal>
                            <Popper placement="bottom" eventsEnabled={profileMenuOpen} className={classNames(classes.profileMenuContainer, { [classes.popperClose]: !profileMenuOpen })}>
                                <ClickAwayListener onClickAway={closeProfileMenu}>
                                    <Collapse in={profileMenuOpen} id="profileMenu">
                                        <Paper className={classes.profileMenu}>
                                            <MenuList role="menu">
                                                <FormattedMessage id="nav.profile" defaultMessage="My profile" description="Profile menu item">
                                                    {(text) => (<MenuItem component={Link} to={`/${lang}/dashboard/profile`} onClick={closeProfileMenu}>{text}</MenuItem>)}
                                                </FormattedMessage>

                                                <FormattedMessage id="nav.appliedJobs" defaultMessage="Applied Jobs" description="Applied jobs menu item">
                                                    {(text) => (<MenuItem onClick={closeProfileMenu}>{text}</MenuItem>)}
                                                </FormattedMessage>

                                                <FormattedMessage id="nav.settings" defaultMessage="Settings" description="Settings menu item">
                                                    {(text) => (<MenuItem onClick={closeProfileMenu}>{text}</MenuItem>)}
                                                </FormattedMessage>

                                                <div className={classes.companiesContainer}>
                                                    <FormattedMessage id="nav.companiesLabel" defaultMessage="My company" description="Settings menu item">
                                                        {(text) => (<span className={classes.companiesContainerTitle}>{text}</span>)}
                                                    </FormattedMessage>


                                                    <FormattedMessage id="nav.companyProfile" defaultMessage="Company profile" description="Logout menu item">
                                                        {(text) => (<MenuItem onClick={closeProfileMenu}>{text}</MenuItem>)}
                                                    </FormattedMessage>

                                                </div>

                                                <FormattedMessage id="nav.logout" defaultMessage="Logout" description="Logout menu item">
                                                    {(text) => (<MenuItem onClick={closeProfileMenu}>{text}</MenuItem>)}
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
                            <IconButton aria-owns={notificationsMenuOpen ? 'notificationsMenu' : null} aria-haspopup="true" onClick={toggleNotificationsMenu} className={classes.notificationsButton}>
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
                            <Popper placement="bottom" eventsEnabled={notificationsMenuOpen} className={classNames({ [classes.popperClose]: !notificationsMenuOpen })}>
                                <ClickAwayListener onClickAway={closeNotificationsMenu}>
                                    <Collapse in={notificationsMenuOpen} id="notificationsMenu">
                                        <Paper className={classes.notificationsMenu}>
                                            {notifications.length &&
                                                <MenuList role="menu">
                                                    {notifications.map((notification, index) => (
                                                        <MenuItem onClick={closeNotificationsMenu} className={classes.notificationItem} key={`notification-${index}`}>
                                                            <Avatar src={notification.avatar} className={classes.notificationAvatar} />
                                                            <div className={classes.notificationBody}>
                                                                <p className={classes.notificationMessage}>{notification.message}</p>
                                                                <p className={classes.notificationElapsed}>{notification.timeElapsed}</p>
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

                    {/* Main navigation*/}
                    <IconButton onClick={toggleMobileNav} className={classes.mobileNavButton}>
                        <MenuIcon />
                    </IconButton>
                    <Drawer anchor="right" open={mobileNavOpen} onClose={closeMobileNav} className={classes.mobileNavContainer}>
                        <div tabIndex={0} role="button" onClick={closeMobileNav} onKeyDown={closeMobileNav} className={classes.mobileNavDrawer}>
                            <FormattedMessage id="nav.newsFeed" defaultMessage="News feed" description="News feed menu item">
                                {(text) => (
                                    <ListItem button component={NavLink} exact to={`/${lang}/dashboard/news`} onClick={closeMobileNav} className={classes.mobileNavButton}>
                                        {text}
                                    </ListItem>
                                )}
                            </FormattedMessage>

                            <FormattedMessage id="nav.companies" defaultMessage="Companies" description="Companies menu item">
                                {(text) => (
                                    <ListItem button component={NavLink} exact to={`/${lang}/dashboard/companies`} onClick={closeMobileNav} className={classes.mobileNavButton}>
                                        {text}
                                    </ListItem>
                                )}
                            </FormattedMessage>

                            <FormattedMessage id="nav.people" defaultMessage="People" description="People menu item">
                                {(text) => (
                                    <ListItem button component={NavLink} exact to={`/${lang}/dashboard/people`} onClick={closeMobileNav} className={classes.mobileNavButton}>
                                        {text}
                                    </ListItem>
                                )}
                            </FormattedMessage>

                            <FormattedMessage id="nav.jobs" defaultMessage="Jobs" description="Jobs menu item">
                                {(text) => (
                                    <ListItem button component={NavLink} exact to={`/${lang}/dashboard/jobs`} onClick={closeMobileNav} className={classes.mobileNavButton}>
                                        {text}
                                    </ListItem>
                                )}
                            </FormattedMessage>
                        </div>
                    </Drawer>
                </Grid>
            </Hidden>
        </Grid>
    );
};

export default Navigation;