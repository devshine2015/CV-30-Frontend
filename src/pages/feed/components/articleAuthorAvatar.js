import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '@material-ui/core';

import { defaultUserAvatar } from '../../../constants/utils';
import { s3BucketURL, profilesFolder } from '../../../constants/s3';

const articleAuthorAvatar = props => {
    const { hasAvatar, avatarContentType, id, firstName, lastName, email } = props.profile;
    const avatar = hasAvatar ? `${s3BucketURL}/${profilesFolder}/${id}/avatar.${avatarContentType}` : defaultUserAvatar;

    return  (
        <Link to={`/${props.lang}/profile/${id}`}>
            <Avatar
                alt={firstName || lastName || email}
                src={avatar}
                className='avatar'
                imgProps={{ style: { objectFit: 'contain' } }}
                style={{ backgroundColor: '#fff', margin: 3 }} />
        </Link>
    );
}

export default articleAuthorAvatar;