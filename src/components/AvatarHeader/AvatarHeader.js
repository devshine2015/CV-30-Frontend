import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '@material-ui/core';

const AvatarHeader = props => {
    const { displayName, avatar, linkTo, title } = props;

    return (
        <div className='avatarHeader'>
            <Link to={linkTo}>
                <Avatar
                    alt={displayName}
                    src={avatar}
                    className='avatar'
                />
            </Link>
            <Link to={linkTo} style={{ textDecoration: 'none' }}>
                <div className='texts'>
                    <h6 className='holderName'>
                        <span>{displayName}</span>
                        <i className='fas fa-caret-down' />
                    </h6>
                    <p className='holderTitle'>{title}</p>
                </div>
            </Link>
        </div>
    );
}

export default AvatarHeader;