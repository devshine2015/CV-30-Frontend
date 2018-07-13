import React from 'react';
import { Grid, Button, Icon } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { compose, withState, withHandlers, pure } from 'recompose';
import { NavLink, Link } from 'react-router-dom';
import ColorPicker from './colorPicker';

import { s3BucketURL, teamsFolder } from '../../../../constants/s3';

const HeaderHOC = compose(
    withState('colorPickerAnchor', 'setColorPickerAnchor', null),
    withState('forceCoverRender', 'setForceCoverRender', 0),
    withHandlers({
        toggleColorPicker: ({ setColorPickerAnchor }) => (event) => {
            setColorPickerAnchor(event.target);
        },
        closeColorPicker: ({ setColorPickerAnchor }) => () => {
            setColorPickerAnchor(null);
        },
        refetchBgImage: ({ setForceCoverRender }) => () => setForceCoverRender(Date.now()),
    }),
    pure
);

const Header = props => {
    const {
        editMode,
        match: { params: { lang, teamId } },
        queryTeam: { team: { company, hasProfileCover, profileBackgroundColor, name } },
        colorPickerAnchor, toggleColorPicker, closeColorPicker, refetchBgImage, forceCoverRender
    } = props;

    let headerStyle = null;

    if (hasProfileCover) {
        let newCover = `${s3BucketURL}/${teamsFolder}/${teamId}/cover.png?${forceCoverRender}`;
        headerStyle = { background: `url(${newCover})` };
    }
    else if (profileBackgroundColor) {
        headerStyle = { background: profileBackgroundColor }
    }

    return (
        <div className='header' style={headerStyle || null}>
            <Grid container className='headerLinks'>
                <Grid item lg={3} md={5} sm={12} xs={12} className='leftHeaderLinks'>
                    <FormattedMessage id="headerLinks.backTo" defaultMessage="Back to" description="User header back to link">
                        {(text) => (
                            <Button component={Link} to={`/${lang}/dashboard/company/${company.id}`} className='backButton'>
                                <i className='fas fa-angle-left' />
                                {text}&nbsp;{company.name}
                            </Button>
                        )}
                    </FormattedMessage>
                    <span className='teamName'>{name}</span>
                </Grid>
                <Grid item lg={3} md={5} sm={12} xs={12} className='rightHeaderLinks'>
                    <FormattedMessage id="headerLinks.profile" defaultMessage="Profile" description="User header profile link">
                        {(text) => (
                            <Button component={NavLink} exact to={`/${lang}/dashboard/team/${teamId}`} className='headerLink'>
                                {text}
                            </Button>
                        )}
                    </FormattedMessage>

                    <FormattedMessage id="headerLinks.feed" defaultMessage="Feed" description="User header feed link">
                        {(text) => (
                            <Button component={NavLink} exact to={`/${lang}/dashboard/team/${teamId}/feed/`} className='headerLink'>
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
            {editMode &&
                <Button size='small' className='colorPickerButton' disableRipple onClick={toggleColorPicker}>
                    <span className='text'>Change Background</span>
                    <Icon className='icon'>brush</Icon>
                </Button>
            }
            <ColorPicker
                colorPickerAnchor={colorPickerAnchor}
                onClose={closeColorPicker}
                match={props.match}
                company={company}
                refetchBgImage={refetchBgImage}
            />
        </div>
    );
}

export default HeaderHOC(Header);