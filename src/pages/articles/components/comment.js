import React from 'react';
import { Avatar } from '@material-ui/core';

const Comment = comment => {
    // let { author: { firstName, lastName, email, avatar }, date, text } = comment;

    // let fullName = (firstName && lastName) ? `${firstName} ${lastName}` : email;
    let avatar;
    return (
        <div className='comment'>
            <div className='author'>
                <Avatar alt='bla' src={avatar} className='avatar' />
                <div className='texts'>
                    <h6 className='userName'>
                        <span>John Doe</span>
                    </h6>
                    <p className='commentInfo'>
                        <span className='workPlace'>Works at: <span className='companyName'>CV30 Marketing Team</span></span>
                        <span className='commentDate'>&nbsp;3:32 PM</span>
                    </p>
                </div>
            </div>
            <p className='commentBody'>Let's make React Intl and FormatJS better! If you're interested in helping, all contributions are welcome and appreciated. React Intl is just one of many packages that make up the FormatJS suite of packages, and you can contribute to any/all of them, including the Format JS website itself.</p>
        </div>
    )
};

export default Comment;