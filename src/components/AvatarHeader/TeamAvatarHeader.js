import { defaultCompanyLogo } from '../../constants/utils';
import { s3BucketURL } from '../../constants/s3';
import { compose, mapProps, pure } from 'recompose';
import AvatarHeader from './AvatarHeader';

const TeamAvatarHeaderHOC = compose(
    mapProps(({ team: { id, name, coverPath }, lang }) => ({
        avatar: coverPath ? `${s3BucketURL}${coverPath}` : defaultCompanyLogo,
        displayName: name,
        linkTo: `/${lang}/team/${id}`,
        title: 'Team'
    })),
    pure
)

export default TeamAvatarHeaderHOC(AvatarHeader);