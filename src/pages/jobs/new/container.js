import NewJob from './component';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import uuid from 'uuidv4';
import { withRouter } from 'react-router-dom';
import { withFormik } from 'formik';

import { jobDependencies, handleJob, setFeedbackMessage, setEditMode, skillsQuery } from '../../../store/queries';
import { jobsFolder } from '../../../constants/s3';
import jobValidation from './validations';

const NewJobHOC = compose(
    withRouter,
    graphql(skillsQuery, {
        name: 'skillsData'
    }),
    graphql(jobDependencies, {
        name: 'jobDependencies',
        options: props => ({
            fetchPolicy: 'network-only',
            variables: {
                language: props.match.params.lang,
                companyId: props.location.state.companyId
            }
        })
    }),
    graphql(handleJob, { name: 'handleJob' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    graphql(setEditMode, { name: 'setEditMode' }),
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
        handleSubmit: async (values, { props: { handleJob, match: { params: { lang: language } }, history, setFeedbackMessage, setEditMode }, setSubmitting }) => {
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
                await setEditMode({
                    variables: {
                        status: false
                    }
                });
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
    withState('state', 'setState', {
        anchorEl: null,
        imageUploadOpen: false,
        videoShareAnchor: null
    }),
    withHandlers({
        handleDateChange: ({ setFieldValue }) => expireDate => setFieldValue('expireDate', expireDate),
        handleClick: ({ state, setState }) => event => setState({ ...state, anchorEl: event.currentTarget }),
        handleClose: ({ state, setState }) => () => setState({ ...state, anchorEl: null }),
        addField: ({ state, setState, setFieldValue }) => fieldId => {
            setFieldValue(fieldId, '');
            setState({ ...state, anchorEl: null });
        },
        removeTextField: ({ setFieldValue }) => key => setFieldValue(key, null),
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
        openImageUpload: ({ state, setState }) => () => setState({ ...state, imageUploadOpen: true }),
        closeImageUpload: ({ state, setState }) => () => setState({ ...state, imageUploadOpen: false }),
        handleError: ({ setFeedbackMessage }) => async error => {
            console.log(error);
            await setFeedbackMessage({
                variables: {
                    status: 'error',
                    message: error || error.message
                }
            });
        },
        handleSuccess: ({ setFieldValue, values: { id } }) => ({ path, filename }) => setFieldValue('imagePath', path ? path : `/${jobsFolder}/${id}/${filename}`),
        removeImage: ({ setFieldValue }) => () => setFieldValue('imagePath', null),
        removeVideo: ({ setFieldValue }) => () => setFieldValue('videoUrl', null),
        openVideoShare: ({ state, setState }) => ev => setState({ ...state, videoShareAnchor: ev.target }),
        closeVideoShare: ({ state, setState }) => () => setState({ ...state, videoShareAnchor: null })
    }),
    pure
);

export default NewJobHOC(NewJob);