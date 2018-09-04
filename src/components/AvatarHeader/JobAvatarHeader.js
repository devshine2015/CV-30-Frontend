// import React from 'react';
import { compose, mapProps, pure } from 'recompose';

import { defaultCompanyLogo } from '../../constants/utils';
import { s3BucketURL } from '../../constants/s3';
import AvatarHeader from './AvatarHeader';

const JobAvatarHeaderHOC = compose(
    mapProps(({ job: { id, expireDate, company: { name: companyName, logoPath } }, lang }) => ({
        avatar: logoPath ? `${s3BucketURL}${logoPath}` : defaultCompanyLogo,
        displayName: companyName,
        linkTo: `/${lang}/job/${id}`,
        htmlTitle: () => ({__html: `Expires on: <span>${new Date(expireDate).toLocaleDateString()}</span>` }),
        hideCaretDown: true
    })),
    pure
)

export default JobAvatarHeaderHOC(AvatarHeader);