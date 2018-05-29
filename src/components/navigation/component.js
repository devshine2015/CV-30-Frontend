import React from 'react';
import { Grid, Button, Hidden, Icon, Menu, MenuItem, Avatar } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';

import roFlag from './ro_flag.png';
import enFlag from './us_flag.png';



const Navigation = ({ match, classes, anchorElement, handleOpenProfileMenu, handleCloseProfileMenu }) => {
    const lang = match.params.lang;
    debugger;
    return (
        <Grid container className={classes.root}>
            <Grid item sm={1} xs={1} md={1}>
                <NavLink className={classes.brand} to={`/${lang}/dashboard`}>
                    <img src="http://brandmark.io/logo-rank/random/pepsi.png" alt="logo" className={classes.brandImg} />
                </NavLink>
            </Grid>
            <Grid item md={6} sm={11} className={classes.mainNavContainer} id="mainNav">
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

                <Button className={classes.profileButton} onClick={handleOpenProfileMenu}>
                    <Avatar alt="Gabriel" src="http://digitalspyuk.cdnds.net/17/25/980x490/landscape-1498216547-avatar-neytiri.jpg" className={classes.avatar} />
                    Gabriel
                </Button>

                <Menu
                    id="simple-menu"
                    anchorEl={anchorElement}
                    transformOrigin={{ vertical: -90, horizontal: 'left' }}
                    open={Boolean(anchorElement)}
                    onClose={handleCloseProfileMenu}
                    classes={classes.profileMenu}
                >
                    <MenuItem onClick={handleCloseProfileMenu}>Profile</MenuItem>
                    <MenuItem onClick={handleCloseProfileMenu}>My account</MenuItem>
                    <MenuItem onClick={handleCloseProfileMenu}>Logout</MenuItem>
                </Menu>
            </Grid>
        </Grid>
    );
};

export default Navigation;