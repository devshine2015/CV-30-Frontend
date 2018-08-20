import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '@material-ui/core';

import { defaultUserAvatar, defaultCompanyLogo } from '../../../constants/utils';
import { s3BucketURL, profilesFolder, companiesFolder, teamsFolder } from '../../../constants/s3';

const AuthorAvatarHeader = ({ article, lang }) => {
    // const { hasAvatar, avatarContentType, id, firstName, lastName, email } = props.profile;
    // const avatar = hasAvatar ? `${s3BucketURL}/${profilesFolder}/${id}/avatar.${avatarContentType}` : defaultUserAvatar;
    // const fullName = (firstName && lastName) ? `${firstName} ${lastName}` : email;
    let avatar, displayName, linkTo, title;

    const { postAs, postingCompany, postingTeam, author } = article;

    if (postAs === 'profile') {
        const { hasAvatar, avatarContentType, id, firstName, lastName, email, position } = author;
        avatar = hasAvatar ? `${s3BucketURL}/${profilesFolder}/${id}/avatar.${avatarContentType}` : defaultUserAvatar;
        displayName = (firstName && lastName) ? `${firstName} ${lastName}` : email;
        linkTo = `/${lang}/profile/${id}`;
        title = position;
    } else if (postAs === 'company') {
        const { id, name, hasLogo, logoContentType } = postingCompany;
        avatar = hasLogo ? `${s3BucketURL}/${companiesFolder}/${id}/logo.${logoContentType}` : defaultCompanyLogo;
        displayName = name;
        linkTo = `/${lang}/company/${id}`;
        title = 'comppany';
    } else if (postAs === 'team') {
        const { id, name, hasProfileCover, coverContentType } = postingTeam;
        avatar = hasProfileCover ? `${s3BucketURL}/${teamsFolder}/${id}/cover.${coverContentType}` : defaultCompanyLogo;
        displayName = name;
        linkTo = `/${lang}/team/${id}`;
        title = 'team';
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