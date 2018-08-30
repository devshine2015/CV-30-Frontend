import { defaultUserAvatar } from '../../constants/utils';
import { s3BucketURL } from '../../constants/s3';
import { compose, mapProps, pure } from 'recompose';
import AvatarHeader from './AvatarHeader';

const UserAvatarHeaderHOC = compose(
    mapProps(({ profile: { id, firstName, lastName, email, position, avatarPath }, lang }) => ({
        avatar: avatarPath ? `${s3BucketURL}${avatarPath}` : defaultUserAvatar,
        displayName: (firstName && lastName) ? `${firstName} ${lastName}` : email,
        linkTo: `/${lang}/profile/${id}`,
        title: position
    })),
    pure
)

export default UserAvatarHeaderHOC(AvatarHeader);