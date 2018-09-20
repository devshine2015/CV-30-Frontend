import { defaultCompanyLogo } from '../../constants/utils';
import { s3BucketURL } from '../../constants/s3';
import { compose, mapProps, pure } from 'recompose';
import AvatarHeader from './AvatarHeader';
import { injectIntl } from 'react-intl';

const CompanyAvatarHeaderHOC = compose(
    injectIntl,
    mapProps(({ intl, company: { id, name, logoPath, industry }, lang, titleType='industry' }) => ({
        avatar: logoPath ? `${s3BucketURL}${logoPath}` : defaultCompanyLogo,
        displayName: name,
        linkTo: `/${lang}/company/${id}`,
        title: titleType === 'industry' && industry ? intl.formatMessage({ id: `industries.${industry.key}` }) : 'Company'
    })),
    pure
)

export default CompanyAvatarHeaderHOC(AvatarHeader);