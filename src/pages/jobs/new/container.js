import NewJob from './component';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import uuid from 'uuidv4';
import { withRouter } from 'react-router-dom';
import { withFormik } from 'formik';

import { jobDependencies, handleJob, setFeedbackMessage } from '../../../store/queries';
import { jobsFolder } from '../../../constants/s3';
import { jobValidation } from './validations';

const NewJobHOC = compose(
    withRouter,
    graphql(jobDependencies, {
        name: 'jobDependencies',
        options: props => ({
            fetchPolicy: 'network-only',
            variables: {
                language: props.match.params.lang
            }
        })
    }),
    graphql(handleJob, { name: 'handleJob' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withFormik({
        mapPropsToValues: ({ location: { state: { companyId, teamId } } }) => ({
            id: uuid(),
            title: '',
            companyId,
            teamId: teamId || '',
            jobBenefits: [],
            jobTypes: [],
            salary: {
                amountMin: 0,
                amountMax: 1000,
                currency: 'eur',
                isPublic: false
            },
            activityField: '',
            skills: [],
            expireDate: new Date().toISOString().split("T")[0],
            location: '',
            imagePath: '',
            videoUrl: '',
            status: 'draft',
            description: '',
            idealCandidate: ''
        }),
        validationSchema: jobValidation,
        displayName: 'NewJobForm',
        handleSubmit: async (values, { props: { handleJob, match: { params: { lang: language } }, history, setFeedbackMessage }, setSubmitting }) => {
            setSubmitting(true);
            try {
                await handleJob({
                    variables: {
                        language,
                        jobDetails: values
                    }
                });
                await setFeedbackMessage({
                    variables: {
                        status: 'success',
                        message: 'Changes saved successfully.'
                    }
                });
                setSubmitting(false);
                history.push(`/${language}/job/${values.id}`);
            }
            catch (err) {
                setSubmitting(false);
                console.log(err);
                await setFeedbackMessage({
                    variables: {
                        status: 'error',
                        message: err.message
                    }
                });
            }
        }

    }),
    withState('anchorEl', 'setAnchorEl', null),
    withState('imageUploadOpen', 'setImageUploadOpen', false),
    withState('videoShareAnchor', 'setVideoShareAnchor', null),
    withHandlers({
        handleClick: ({ setAnchorEl }) => event => setAnchorEl(event.currentTarget),
        handleClose: ({ setAnchorEl }) => () => setAnchorEl(null),
        addField: ({ setAnchorEl, setFieldValue }) => fieldId => {
            setFieldValue(fieldId, '');
            setAnchorEl(null);
        },
        removeTextField: ({ values }) => async key => {
            await delete values[key];
        },
        updateDescription: ({ setFieldValue }) => text => setFieldValue('description', text),
        updateIdealCandidate: ({ setFieldValue }) => text => setFieldValue('idealCandidate', text),
        handleSliderChange: ({ setFieldValue, values }) => value => {
            setFieldValue('salary', {
                ...values.salary,
                amountMin: value[0],
                amountMax: value[1],
            });
        },
        onSkillsChange: ({ setFieldValue }) => skills => setFieldValue('skills', skills),
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
        handleSuccess: ({ setFieldValue, values: { id } }) => ({ path, filename }) =>
            setFieldValue('imagePath', path ? path : `/${jobsFolder}/${id}/${filename}`),
        removeImage: ({ setFieldValue }) => () => setFieldValue('imagePath', null),
        removeVideo: ({ setFieldValue }) => () => setFieldValue('videoUrl', null),
        openVideoShare: ({ setVideoShareAnchor }) => ev => setVideoShareAnchor(ev.target),
        closeVideoShare: ({ setVideoShareAnchor }) => () => setVideoShareAnchor(null)
    }),
    pure
);

export default NewJobHOC(NewJob);