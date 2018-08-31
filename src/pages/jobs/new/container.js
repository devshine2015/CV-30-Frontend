import NewJob from './component';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import uuid from 'uuidv4';
import { withRouter } from 'react-router-dom';

import { teamsQuery, handleJob, setFeedbackMessage, jobTypesQuery } from '../../../store/queries';
import { jobsFolder } from '../../../constants/s3';

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
    graphql(jobTypesQuery, {
        name: 'jobTypesQuery',
        options: props => ({
            fetchPolicy: 'network-only',
            variables: {
                language: props.match.params.lang
            }
        })
    }),
    graphql(handleJob, { name: 'handleJob' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('formData', 'setFormData', ({ location: { state: { companyId, teamId } } }) => {
        return {
            id: uuid(),
            companyId,
            teamId,
            benefits: [],
            selectedJobTypes: [],
            salary: {
                amountMin: 0,
                amountMax: 1000,
                currency: 'eur'
            },
            salaryRangeStart: 0,
            salaryRangeEnd: 5000,
            salaryPublic: false,
            skills: [],
            expireDate: new Date(),
            location: '',
            imagePath: '',
            videoUrl: '',
            status: 'draft'
        };
    }),
    withState('isUploading', 'setIsUploading', false),
    withState('uploadProgress', 'setUploadProgress', 0),
    withState('anchorEl', 'setAnchorEl', null),
    withState('imageUploadOpen', 'setImageUploadOpen', false),
    withState('videoShareAnchor', 'setVideoShareAnchor', null),
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
        publishJob: ({ handleJob, formData, match, history, setFeedbackMessage }) => async () => {
            const { id, companyId, teamId, title, description, expireDate, idealCandidate,
                selectedJobTypes: jobTypes, salary, salaryPublic, skills, activityField, imagePath,
                videoUrl, location, status } = formData;

            try {
                await handleJob({
                    variables: {
                        language: match.params.lang,
                        jobDetails: {
                            id,
                            companyId,
                            teamId,
                            title,
                            description,
                            expireDate,
                            idealCandidate,
                            jobTypes,
                            salary: {
                                ...salary,
                                isPublic: salaryPublic
                            },
                            skills,
                            activityField,
                            imagePath,
                            videoUrl,
                            location,
                            status
                        }
                    }
                });
                await setFeedbackMessage({
                    variables: {
                        status: 'success',
                        message: 'Changes saved successfully.'
                    }
                });
                history.push(`/${match.params.lang}/job/${formData.id}`);
            }
            catch (err) {
                console.log(err);
                await setFeedbackMessage({
                    variables: {
                        status: 'error',
                        message: err.message
                    }
                });
            }
        },
        handleClick: ({ setAnchorEl }) => event => setAnchorEl(event.currentTarget),
        handleClose: ({ setAnchorEl }) => () => setAnchorEl(null),
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
        updateIdealCandidate: props => text => props.setFormData(state => ({ ...state, 'idealCandidate': text })),
        handleSliderChange: ({ setFormData, formData }) => value =>
            setFormData({
                ...formData,
                salary: {
                    ...formData.salary,
                    amountMin: value[0],
                    amountMax: value[1]
                }
            }),
        onSkillsChange: ({ setFormData, formData }) => skills => setFormData({ ...formData, skills }),
        openImageUpload: ({ setImageUploadOpen }) => () => setImageUploadOpen(true),
        closeImageUpload: ({ setImageUploadOpen }) => () => setImageUploadOpen(false),
        handleError: ({ setFeedbackMessage }) => async error => {
            console.log(error);
            await setFeedbackMessage({
                variables: {
                    status: 'error',
                    message: error || error.message
                }
            });
        },
        handleSuccess: ({ setFormData, formData: { id } }) => ({ path, filename }) =>
            setFormData(state => ({ ...state, imagePath: path ? path : `/${jobsFolder}/${id}/${filename}` })),
        removeImage: ({ setFormData }) => () => setFormData(state => ({ ...state, imagePath: null })),
        removeVideo: ({ setFormData }) => () => setFormData(state => ({ ...state, videoUrl: null })),
        openVideoShare: ({ setVideoShareAnchor }) => ev => setVideoShareAnchor(ev.target),
        closeVideoShare: ({ setVideoShareAnchor }) => () => setVideoShareAnchor(null),
        handleVideoKeyPress: ({ setFormData, setVideoShareAnchor }) => event => {
            if (event.key === 'Enter') {
                const videoUrl = event.target.value;
                setFormData(state => ({ ...state, videoUrl }));
                setVideoShareAnchor(null);
            }
        }
    }),
    pure
);

export default NewJobHOC(NewJob);