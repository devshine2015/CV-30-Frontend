import React from 'react';

import UserAvatarHeader from './UserAvatarHeader';
import CompanyAvatarHeader from './CompanyAvatarHeader';
import TeamAvatarHeader from './TeamAvatarHeader';

const AuthorAvatarHeader = ({ article, lang }) => {
    const { postAs, postingCompany, postingTeam, author } = article;

    if (postAs === 'profile') {
        return <UserAvatarHeader profile={author} lang={lang} />;
    } else if (postAs === 'company') {
        return <CompanyAvatarHeader company={postingCompany} lang={lang} />;
    } else if (postAs === 'team') {
        return <TeamAvatarHeader team={postingTeam} lang={lang} />;
    }

    return null;
};

export default AuthorAvatarHeader;