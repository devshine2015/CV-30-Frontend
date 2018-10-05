import React from 'react';

const TeamMember = props => {
    const { img, firstName, lastName, title } = props;
    const name = `${firstName} ${lastName}`;
    const style = {
        background: `url(${img})`,
        backgroundSize: 'cover'
    }
    return (
        <div className='member' style={style}>
            <p className='name'>{name}</p>
            <p className='title'>{title}</p>
           
        </div>
    );
}

export default TeamMember;