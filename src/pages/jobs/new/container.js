import NewJob from './component';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import uuid from 'uuidv4';
import { withRouter } from 'react-router-dom';

import { teamsQuery, handleJob } from '../../../store/queries';

const NewJobHOC = compose(
    withRouter,
    graphql(teamsQuery, {
        name: 'teamsQuery',
        options: props => ({
            fetchPolicy: 'network-only',
            variables: {
                language: props.match.params.lang
            }
        })
    }),
    graphql(handleJob, { name: 'handleJob' }),
    withState('formData', 'setFormData', ({ location: { state: { companyId, teamId } } }) => {
        return {
            id: uuid(),
            companyId,
            teamId,
            benefits: []
        };
    }),
    withState('isUploading', 'setIsUploading', false),
    withState('uploadProgress', 'setUploadProgress', 0),
    withState('uploadError', 'setUploadError', null),
    withState('anchorEl', 'setAnchorEl', null),
    withHandlers({
        handleFormChange: props => event => {
            const target = event.target;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;
            if (!name) {
                throw Error('Field must have a name attribute!');
            }
            props.setFormData(state => ({ ...state, [name]: value }));
        },
        getSignedUrl: () => async (file, callback) => {
            let getExtension = file.name.slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2);
            let fName = ['job', getExtension].join('.');

            const params = {
                fileName: fName,
                contentType: file.type
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
            let fName = ['job', getExtension].join('.');
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
        onFinishUpload: ({ setIsUploading }) => () => {
            alert('done!');
            setIsUploading(false);
        },
        publishJob: ({ handleJob, formData, match, history }) => async () => {
            const { id, companyId, teamId, title, description, expireDate, idealCandidate } = formData;
            try {
                await handleJob({
                    variables: {
                        language: match.params.lang,
                        jobDetails: {
                            id, companyId, teamId, title, description, expireDate, idealCandidate
                        }
                    }
                });
                history.push(`/${match.params.lang}/dashboard/job/${formData.id}`);
            }
            catch (err) {
                console.log(err);
            }
        },

        handleClick: ({ setAnchorEl }) => event => {
            setAnchorEl(event.currentTarget);
        },

        handleClose: ({ setAnchorEl }) => () => {
            setAnchorEl(null);
        },
        addField: ({ setAnchorEl, formData, setFormData }) => (fieldId) => {
            let contact = Object.assign({}, formData);
            if (!contact[fieldId]) {
                contact[fieldId] = '';
                setFormData(contact);
            }
            setAnchorEl(null);
        },
        removeTextField: ({ formData, setFormData }) => async (key) => {
            let contact = Object.assign({}, formData);
            await delete contact[key];
            setFormData(contact);
        },
        updateDescription: props => text => props.setFormData(state => ({ ...state, 'description': text })),
        updateIdealCandidate: props => text => props.setFormData(state => ({ ...state, 'idealCandidate': text }))
    }),
    pure
);

export default NewJobHOC(NewJob);