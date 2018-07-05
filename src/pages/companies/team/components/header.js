import React from 'react';
import { Grid, Button } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
// import { compose, withState, withHandlers, pure } from 'recompose';
import { NavLink, Link } from 'react-router-dom';

const Header = props => {
    const { match } = props;
    const lang = match.params.lang;
    return (
        <div className='header'>
            <Grid container className='headerLinks'>
                <Grid item lg={3} md={5} sm={12} xs={12} className='leftHeaderLinks'>
                    <FormattedMessage id="headerLinks.backTo" defaultMessage="Back to" description="User header back to link">
                        {(text) => (
                            <Button component={Link} to={`/${lang}/dashboard/company/`} className='backButton'>
                                <i className='fas fa-angle-left' />
                                {text} Ursus Romania
                            </Button>
                        )}
                    </FormattedMessage>
                    <span className='teamName'>Echipa de inovatii</span>
                </Grid>
                <Grid item lg={3} md={5} sm={12} xs={12} className='rightHeaderLinks'>
                    <FormattedMessage id="headerLinks.profile" defaultMessage="Profile" description="User header profile link">
                        {(text) => (
                            <Button component={NavLink} exact to={`/${lang}/dashboard/company/team`} className='headerLink'>
                                {text}
                            </Button>
                        )}
                    </FormattedMessage>

                    <FormattedMessage id="headerLinks.feed" defaultMessage="Feed" description="User header feed link">
                        {(text) => (
                            <Button component={NavLink} exact to={`/${lang}/dashboard/company/team/feed/`} className='headerLink'>
                                {text}
                            </Button>
                        )}
                    </FormattedMessage>

                    <FormattedMessage id="headerLinks.follow" defaultMessage="Follow" description="User header follow button">
                        {(text) => (
                            <Button className='headerButton'>
                                {text}
                            </Button>
                        )}
                    </FormattedMessage>

                </Grid>
            </Grid>
        </div>
    );
}

export default Header;