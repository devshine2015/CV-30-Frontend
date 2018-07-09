import JobsList from './component';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { getJobsQuery } from '../../../store/queries';
import { withRouter } from 'react-router-dom';

const jobs = [
    {
        company: 'Vodafone',
        expirationDate: '11-12-2019',
        location: 'Timisoara',
        match: 65,
        title: 'Some job title goes here',
        jobLevels: ['entry', 'mid', 'senior'],
        benefits: [
            {
                icon: 'fas fa-car',
                label: 'Car'
            },
            {
                icon: 'fas fa-mobile-alt',
                label: 'Phone'
            }, {
                icon: 'fas fa-laptop',
                label: 'Laptop'
            }, {
                icon: 'fas fa-car',
                label: 'Car'
            },
            {
                icon: 'fas fa-car',
                label: 'Car'
            },
            {
                icon: 'fas fa-mobile-alt',
                label: 'Phone'
            }, {
                icon: 'fas fa-laptop',
                label: 'Laptop'
            }, {
                icon: 'fas fa-car',
                label: 'Car'
            },
            {
                icon: 'fas fa-car',
                label: 'Car'
            },
            {
                icon: 'fas fa-mobile-alt',
                label: 'Phone'
            }, {
                icon: 'fas fa-laptop',
                label: 'Laptop'
            }, {
                icon: 'fas fa-car',
                label: 'Car'
            }
        ],
        videos: [{
            url: ''
        }],
        images: [{
            url: ''
        }],
        description: 'Lorem ipsum dolor sit amet, te viderer alienum forensibus duo, has id quodsi pertinax persequeris, dolorem oportere his no. Ea ius commune quaerendum, et tollit quaestio pertinacia vis, labores singulis mea te. No vel prompta neglegentur comprehensam, ad sea alii tibique efficiendi.'
    },
    {
        company: 'Vodafone',
        expirationDate: '11-12-2019',
        location: 'Timisoara',
        match: 85,
        title: 'Some job title goes here',
        jobLevels: ['entry', 'mid', 'senior', 'entry', 'mid', 'senior', 'entry', 'mid', 'senior', 'entry', 'mid', 'senior', 'entry', 'mid', 'senior', 'entry', 'mid', 'senior'],
        videos: [{
            url: ''
        }],
        images: [{
            url: ''
        }],
        description: 'Lorem ipsum dolor sit amet, te viderer alienum forensibus duo, has id quodsi pertinax persequeris, dolorem oportere his no. Ea ius commune quaerendum, et tollit quaestio pertinacia vis, labores singulis mea te. No vel prompta neglegentur comprehensam, ad sea alii tibique efficiendi.'
    },
    {
        company: 'Vodafone',
        expirationDate: '11-12-2019',
        location: 'Timisoara',
        match: 95,
        title: 'Some job title goes here',
        jobLevels: ['entry', 'mid', 'senior'],
        benefits: [
            {
                icon: 'fas fa-car',
                label: 'Car'
            },
            {
                icon: 'fas fa-mobile-alt',
                label: 'Phone'
            }, {
                icon: 'fas fa-laptop',
                label: 'Laptop'
            }, {
                icon: 'fas fa-car',
                label: 'Car'
            }
        ],
        description: 'Lorem ipsum dolor sit amet, te viderer alienum forensibus duo, has id quodsi pertinax persequeris, dolorem oportere his no. Ea ius commune quaerendum, et tollit quaestio pertinacia vis, labores singulis mea te. No vel prompta neglegentur comprehensam, ad sea alii tibique efficiendi.'
    },
    {
        title: 'Some job title goes here',
        company: 'Vodafone',
        expirationDate: '11-12-2019',
        location: 'Timisoara',
        match: 25,
        jobLevels: ['entry', 'mid', 'senior'],
        benefits: [
            {
                icon: 'fas fa-car',
                label: 'Car'
            },
            {
                icon: 'fas fa-mobile-alt',
                label: 'Phone'
            }, {
                icon: 'fas fa-laptop',
                label: 'Laptop'
            }, {
                icon: 'fas fa-car',
                label: 'Car'
            }
        ],
        videos: [{
            url: ''
        }],
        images: [{
            url: ''
        }],
        description: 'Lorem ipsum dolor sit amet, te viderer alienum forensibus duo, has id quodsi pertinax persequeris, dolorem oportere his no. Ea ius commune quaerendum, et tollit quaestio pertinacia vis, labores singulis mea te. No vel prompta neglegentur comprehensam, ad sea alii tibique efficiendi.'
    },


];

const JobsListHOC = compose(
    withRouter,
    graphql(getJobsQuery, {
        name: 'getJobsQuery',
        fetchPolicy: 'network-only',
        options: props => ({
            variables: {
                language: props.match.params.lang
            },
        }),
    }),
    withState('formData', 'setFormData', {}),
    withHandlers({
        handleFormChange: props => event => {
            const target = event.currentTarget;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;
            if (!name) {
                throw Error('Field must have a name attribute!');
            }
            props.setFormData(state => ({ ...state, [name]: value }));
        },
        handleSliderChange: () => (value) => {
            console.log(value);
        }
    }),
    pure
);

export default JobsListHOC(JobsList);