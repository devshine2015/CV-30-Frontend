import { defaultCompanyLogo } from '../../constants/utils';
import { s3BucketURL } from '../../constants/s3';
import { compose, mapProps, pure } from 'recompose';
import AvatarHeader from './AvatarHeader';

const CompanyAvatarHeaderHOC = compose(
    mapProps(({ company: { id, name, logoPath, industry }, lang, titleType='industry' }) => ({
        avatar: logoPath ? `${s3BucketURL}${logoPath}` : defaultCompanyLogo,
        displayName: name,
        linkTo: `/${lang}/company/${id}`,
        title: titleType === 'industry' && industry ? industry.i18n[0].title : 'Company'
    })),
    pure
)

export default CompanyAvatarHeaderHOC(AvatarHeader);