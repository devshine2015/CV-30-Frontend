import NewCompany from './component';
import { compose, pure } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { withFormik } from 'formik';

import schema from './validation';
import { handleCompany, setFeedbackMessage } from '../../../store/queries';
import { companiesRefetch, currentProfileRefetch } from '../../../store/refetch';

const NewCompanyHOC = compose(
    withRouter,
    graphql(handleCompany, { name: 'handleCompany' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withFormik({
        mapPropsToValues: () => ({
            name: '',
            industryId: undefined,
            noOfEmployees: '',
            location: ''
        }),
        validationSchema: schema,
        handleSubmit: async (values, { props: { handleCompany, match, history, setFeedbackMessage }, setSubmitting }) => {
            try {
                await handleCompany({
                    variables: {
                        language: match.params.lang,
                        details: values
                    },
                    refetchQueries: [companiesRefetch(match.params.lang), currentProfileRefetch(match.params.lang)]
                });
                await setFeedbackMessage({
                    variables: {
                        status: 'success',
                        message: 'Changes saved successfully.'
                    }
                });
                history.push(`/${match.params.lang}/companies`);
            } catch (err) {
                setSubmitting(false);
                await setFeedbackMessage({
                    variables: {
                        status: 'error',
                        message: err.message
                    }
                });
            }
        },
        displayName: 'AddCompanyForm', // helps with React DevTools
    }),
    pure
);

export default NewCompanyHOC(NewCompany);