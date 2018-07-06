import NewCompany from './component';
import { compose, withState, withHandlers, pure } from 'recompose';
import uuid from 'uuid/v4';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { handleCompany } from '../../../store/queries';

const NewCompanyHOC = compose(
    withRouter,
    graphql(handleCompany, { name: 'handleCompany' }),
    // withState('formData', 'setFormData', { id: uuid() }),
    withState('uploadProgress', 'setUploadProgress', 0),
    withState('uploadError', 'setUploadError', null),
    withState('isUploading', 'setIsUploading', false),
    withHandlers({
        getSignedUrl: ({ location: { state: { profile } } }) => async (file, callback) => {
            let getExtension = file.name.slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2);
            let fName = ['logo', getExtension].join('.');

            const params = {
                fileName: fName,
                contentType: file.type,
                id: profile.id,
                type: 'logo'
            };

            try {
                let response = await fetch('https://k73nyttsel.execute-api.eu-west-1.amazonaws.com/production/getSignedURL', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(params)
                });
                let responseJson = await response.json();
                callback(responseJson);
            } catch (error) {
                console.error(error);
                callback(error)
            }
        },
        renameFile: () => filename => {
            let getExtension = filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
            let fName = ['avatar', getExtension].join('.');
            return fName;
        },
        onUploadStart: ({ setIsUploading }) => (file, next) => {
            let size = file.size;
            if (size > 500 * 1024) {
                alert('File is too big!');
            } else {
                setIsUploading(true);
                next(file);
            }
        },
        onProgress: ({ setUploadProgress }) => (percent) => {
            setUploadProgress(percent);
        },
        onError: ({ setUploadError }) => error => {
            setUploadError(error);
            console.log(error);
        },
        onFinishUpload: (props) => async () => {
            const { setIsUploading/*, updateAvatar, updateAvatarTimestamp, match*/ } = props;
            // await updateAvatar({
            //     variables: {
            //         status: true
            //     },
            //     refetchQueries: [{
            //         query: currentUserQuery,
            //         fetchPolicy: 'network-only',
            //         name: 'currentUser',
            //         variables: {
            //             language: 'en',
            //             id: match.params.profileId
            //         }
            //     }]
            // });
            // await updateAvatarTimestamp({
            //     variables: {
            //         timestamp: Date.now()
            //     }
            // });

            setIsUploading(false);
        },
        // handleFormChange: ({ setFormData }) => event => {
        //     const target = event.currentTarget;
        //     const value = target.type === 'checkbox' ? target.checked : target.value;
        //     const name = target.name;
        //     if (!name) {
        //         throw Error('Field must have a name attribute!');
        //     }
        //     setFormData(state => ({ ...state, [name]: value }));
        // },
        // cancel: ({ history }) => () => {
        //     history.goBack()
        // },
        // save: ({ formData }) => () => {
        //     console.log(formData);
        // }
    }),
    pure
);

export default NewCompanyHOC(NewCompany);