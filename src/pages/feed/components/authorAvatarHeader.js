import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '@material-ui/core';

import { defaultUserAvatar } from '../../../constants/utils';
import { s3BucketURL, profilesFolder } from '../../../constants/s3';

const authorAvatarHeader = props => {
    const { hasAvatar, avatarContentType, id, firstName, lastName, email } = props.profile;
    const avatar = hasAvatar ? `${s3BucketURL}/${profilesFolder}/${id}/avatar.${avatarContentType}` : defaultUserAvatar;
    const fullName = (firstName && lastName) ? `${firstName.charAt(0)}${lastName.charAt(0)}` : email;

    return  (
        <div className='leftOverlay'>
            <Link to={`/${props.lang}/profile/${id}`}>
                <Avatar
                    alt={firstName || lastName || email}
                    src={avatar}
                    className='avatar'
                    imgProps={{ style: { objectFit: 'contain' } }}
                    style={{ backgroundColor: '#fff', margin: 3 }} />
            </Link>
            <Link to={`/${props.lang}/profile/${id}`} style={{ textDecoration: 'none' }}>
                <div className='leftOverlayTexts'>
                    <h6 className='userName'>
                        <span>{fullName}</span>
                        <i className='fas fa-caret-down' />
                    </h6>
                    <p className='userTitle'>Manager</p>
                </div>
            </Link>
        </div>
    );
}

export default authorAvatarHeader;