import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '@material-ui/core';

import { defaultUserAvatar, defaultCompanyLogo } from '../../../constants/utils';
import { s3BucketURL, teamsFolder } from '../../../constants/s3';

const AuthorAvatarHeader = ({ article, lang }) => {
    let avatar, displayName, linkTo, title;

    const { postAs, postingCompany, postingTeam, author } = article;

    if (postAs === 'profile') {
        const { id, firstName, lastName, email, position, avatarPath } = author;
        avatar = avatarPath ? `${s3BucketURL}${avatarPath}` : defaultUserAvatar;
        displayName = (firstName && lastName) ? `${firstName} ${lastName}` : email;
        linkTo = `/${lang}/profile/${id}`;
        title = position;
    } else if (postAs === 'company') {
        const { id, name, logoPath } = postingCompany;
        avatar = logoPath ? `${s3BucketURL}${logoPath}` : defaultCompanyLogo;
        displayName = name;
        linkTo = `/${lang}/company/${id}`;
        title = 'Comppany';
    } else if (postAs === 'team') {
        const { id, name, coverPath } = postingTeam;
        avatar = coverPath ? `${s3BucketURL}${coverPath}` : defaultCompanyLogo;
        displayName = name;
        linkTo = `/${lang}/team/${id}`;
        title = 'Team';
    }

    return (
        <div className='leftOverlay'>
            <Link to={linkTo}>
                <Avatar
                    alt={displayName}
                    src={avatar}
                    className='avatar'
                />
            </Link>
            <Link to={linkTo} style={{ textDecoration: 'none' }}>
                <div className='leftOverlayTexts'>
                    <h6 className='userName'>
                        <span>{displayName}</span>
                        <i className='fas fa-caret-down' />
                    </h6>
                    <p className='userTitle'>{title}</p>
                </div>
            </Link>
        </div>
    );
};

export default AuthorAvatarHeader;