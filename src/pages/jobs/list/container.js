import JobsList from './component';
import { compose, withState, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { getJobsQuery } from '../../../store/queries';
import { withRouter } from 'react-router-dom';

const JobsListHOC = compose(
    withRouter,
    withState('searchData', 'setSearchData', {
        title: '',
        location: '',
        companyName: '',
        jobTypes: [],
        //salary: JobCompensationFilterInput
        skills: [],
        benefits: [],
        //teamId: String
        industryId: undefined,
        companyTypes: []
    }),
    pure,
    graphql(getJobsQuery, {
        name: 'getJobsQuery',
        options: ({ match, searchData: { title, location, companyName, jobTypes, skills, benefits, industryId, companyTypes}}) => ({
            fetchPolicy: 'network-only',
            variables: {
                language: match.params.lang,
                filter: {
                    title,
                    location,
                    companyName,
                    jobTypes,
                    skills,
                    benefits,
                    industryId,
                    companyTypes
                },
                first: 10
            },
        }),
    })
);

export default JobsListHOC(JobsList);