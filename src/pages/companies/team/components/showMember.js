import React from 'react';
import { compose, withState, withHandlers, pure } from 'recompose';
import { defaultUserAvatar } from '../../../../constants/utils';
import { FormattedMessage } from 'react-intl'
import { Avatar, IconButton, Icon, Popover } from '@material-ui/core';
import { s3BucketURL } from '../../../../constants/s3';
import { Link, withRouter } from 'react-router-dom';

const ShowMemberHOC = compose(
    withRouter,
    withState('detailsAnchor', 'setDetailsAnchor', null),
    withHandlers({
        showDetails: ({ setDetailsAnchor }) => target => setDetailsAnchor(target),
        hideDetails: ({ setDetailsAnchor }) => () => setDetailsAnchor(null),
    }),
    pure);

const ShowMember = ({ profile, removeMember, editMode, detailsAnchor, showDetails, hideDetails, type, match: { params: { lang } } }) => {
    const { id, avatarPath, firstName, lastName, email, position, description } = profile;
    let avatar = avatarPath ? `${s3BucketURL}${avatarPath}` : defaultUserAvatar;
    let initials = (firstName && lastName) ? `${firstName.charAt(0)}${lastName.charAt(0)}` : email;
    const fullName = (firstName && lastName) ? `${firstName} ${lastName}` : email;

    return (
        <div className='teamMember'>
            <Avatar src={avatar} className='avatar'>
                {
                    !avatarPath ?
                        initials
                        : null
                }
            </Avatar>
            <span className='teamMemberName'>{fullName}</span>
            <i className='fas fa-check-circle' onClick={(event) => showDetails(event.target)} />
            {
                editMode &&
                <IconButton className='removeBtn' onClick={() => removeMember(id)}>
                    <Icon>cancel</Icon>
                </IconButton>
            }

            <Popover
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                open={Boolean(detailsAnchor)}
                anchorEl={detailsAnchor}
                onClose={hideDetails}
                classes={{
                    paper: 'detailsPaper'
                }}
            >

                <p className='title'>{position}</p>
                {type === 'user' ?
                    <React.Fragment>
                        <FormattedMessage id="company.team.viewProfile" defaultMessage="View profile" description="View profile">
                            {(text) => (
                                <Link to={`/${lang}/profile/${id}`} className='detailsLink'>Vezi profilul</Link>
                            )}
                        </FormattedMessage>
                        <FormattedMessage id="company.team.hisArticles" defaultMessage="`s articles" description="His Articles">
                            {(text) => (
                                <Link to={`/${lang}/profile/${id}/feed`} className='detailsLink'>{lang === "en"? {firstName} : {text}} {lang !== "en"? {text} : {firstName}}  </Link>
                            )}
                        </FormattedMessage>
                        
                    </React.Fragment>
                    : <p className='description'>{description}</p>
                }

            </Popover>
        </div>
    )
};

export default ShowMemberHOC(ShowMember);