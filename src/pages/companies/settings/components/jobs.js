import React from 'react';
import JobItem from '../../../jobs/list/components/jobItem';

const jobs = [
    {
        company: 'Vodafone',
        expirationDate: '11-12-2019',
        appliedDate: '11-12-2019',
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


const JobsList = props => {
    return (
        <div className='jobsList'>
            {jobs.map((job, index) => (<JobItem {...job} key={`job-${index}`} />))}
        </div>
    );
}

export default JobsList;