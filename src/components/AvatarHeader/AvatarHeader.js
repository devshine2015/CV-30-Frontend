import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '@material-ui/core';

const AvatarHeader = props => {
    const { displayName, avatar, linkTo, title, htmlTitle, hideCaretDown } = props;

    return (
        <Link to={linkTo} className='avatarHeader'>
            <Avatar
                alt={displayName}
                src={avatar}
                className='avatar'
            />
            <div className='texts'>
                <h6 className='holderName'>
                    <span>{displayName}</span>
                { !hideCaretDown && <i className='fas fa-caret-down' /> }
                </h6>
                { htmlTitle && <p className='holderTitle' dangerouslySetInnerHTML={htmlTitle()}/> }
                { title && <p className='holderTitle'>{title}</p> }
            </div>
        </Link>
    );
}

export default AvatarHeader;