import React from 'react';

import UserAvatarHeader from './UserAvatarHeader';
import CompanyAvatarHeader from './CompanyAvatarHeader';
import TeamAvatarHeader from './TeamAvatarHeader';

const AuthorAvatarHeader = ({ article, lang }) => {
    const { postAs, postingCompany, postingTeam, author } = article;

    switch (postAs) {
        case 'profile':
            return <UserAvatarHeader profile={author} lang={lang} />;
        case 'company':
            return <CompanyAvatarHeader company={postingCompany} lang={lang} />;
        case 'team':
            return <TeamAvatarHeader team={postingTeam} lang={lang} />;
        default:
            return null;
    }
};

export default AuthorAvatarHeader;