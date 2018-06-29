import CompaniesList from './component';
import { compose, withState, withHandlers, pure } from 'recompose';

const data = [
    {
        name: 'Bodaphone',
        field: 'Telecom',
        location: 'Capitala',
        employees: '100-500',
        description: 'Ad tantas instructior vituperatoribus pri, et per legendos reprimique, ad nemore consetetur vim. Libris voluptaria sit cu. Dicam consequat usu ut. In simul homero quodsi mea.',
        jobs: [
            { title: 'Job 1', location: 'Mars', date: '13-10-2008', level: 'beginner' },
            { title: 'Job 2', location: 'Mars', date: '13-10-2008', level: 'beginner' },
            { title: 'Job 3', location: 'Mars', date: '13-10-2008', level: 'beginner' },
            { title: 'Job 4', location: 'Mars', date: '13-10-2008', level: 'beginner' },
            { title: 'Job 5', location: 'Mars', date: '13-10-2008', level: 'beginner' },
        ],
        team: [
            {
                firstName: 'John',
                lastName: 'Doe',
                title: 'Bad ass',
                img: 'http://themes.dfd.name/sunday/shortcodes/wp-content/uploads/2015/03/man_3-380x340.jpg'
            }, {
                firstName: 'John',
                lastName: 'Doe',
                title: 'Bad ass',
                img: 'http://themes.dfd.name/sunday/shortcodes/wp-content/uploads/2015/03/man_3-380x340.jpg'
            }, {
                firstName: 'John',
                lastName: 'Doe',
                title: 'Bad ass',
                img: 'http://themes.dfd.name/sunday/shortcodes/wp-content/uploads/2015/03/man_3-380x340.jpg'
            }, {
                firstName: 'John',
                lastName: 'Doe',
                title: 'Bad ass',
                img: 'http://themes.dfd.name/sunday/shortcodes/wp-content/uploads/2015/03/man_3-380x340.jpg'
            }, {
                firstName: 'John',
                lastName: 'Doe',
                title: 'Bad ass',
                img: 'http://themes.dfd.name/sunday/shortcodes/wp-content/uploads/2015/03/man_3-380x340.jpg'
            }
        ]
    },
    {
        name: 'Bodaphone',
        field: 'Telecom',
        location: 'Capitala',
        employees: '100-500',
        description: 'Ad tantas instructior vituperatoribus pri, et per legendos reprimique, ad nemore consetetur vim. Libris voluptaria sit cu. Dicam consequat usu ut. In simul homero quodsi mea.',
        jobs: [
            { title: 'Job 1', location: 'Mars', date: '13-10-2008', level: 'beginner' },
            { title: 'Job 2', location: 'Mars', date: '13-10-2008', level: 'beginner' },
            { title: 'Job 3', location: 'Mars', date: '13-10-2008', level: 'beginner' },
            { title: 'Job 4', location: 'Mars', date: '13-10-2008', level: 'beginner' },
            { title: 'Job 5', location: 'Mars', date: '13-10-2008', level: 'beginner' },
        ],
        team: [
            {
                firstName: 'John',
                lastName: 'Doe',
                title: 'Bad ass',
                img: 'http://themes.dfd.name/sunday/shortcodes/wp-content/uploads/2015/03/man_3-380x340.jpg'
            }, {
                firstName: 'John',
                lastName: 'Doe',
                title: 'Bad ass',
                img: 'http://themes.dfd.name/sunday/shortcodes/wp-content/uploads/2015/03/man_3-380x340.jpg'
            }, {
                firstName: 'John',
                lastName: 'Doe',
                title: 'Bad ass',
                img: 'http://themes.dfd.name/sunday/shortcodes/wp-content/uploads/2015/03/man_3-380x340.jpg'
            }, {
                firstName: 'John',
                lastName: 'Doe',
                title: 'Bad ass',
                img: 'http://themes.dfd.name/sunday/shortcodes/wp-content/uploads/2015/03/man_3-380x340.jpg'
            }, {
                firstName: 'John',
                lastName: 'Doe',
                title: 'Bad ass',
                img: 'http://themes.dfd.name/sunday/shortcodes/wp-content/uploads/2015/03/man_3-380x340.jpg'
            }
        ]
    },
    {
        name: 'Bodaphone',
        field: 'Telecom',
        location: 'Capitala',
        employees: '100-500',
        description: 'Ad tantas instructior vituperatoribus pri, et per legendos reprimique, ad nemore consetetur vim. Libris voluptaria sit cu. Dicam consequat usu ut. In simul homero quodsi mea.',
        jobs: [
            { title: 'Job 1', location: 'Mars', date: '13-10-2008', level: 'beginner' },
            { title: 'Job 2', location: 'Mars', date: '13-10-2008', level: 'beginner' },
            { title: 'Job 3', location: 'Mars', date: '13-10-2008', level: 'beginner' },
            { title: 'Job 4', location: 'Mars', date: '13-10-2008', level: 'beginner' },
            { title: 'Job 5', location: 'Mars', date: '13-10-2008', level: 'beginner' },
        ],
        team: [
            {
                firstName: 'John',
                lastName: 'Doe',
                title: 'Bad ass',
                img: 'http://themes.dfd.name/sunday/shortcodes/wp-content/uploads/2015/03/man_3-380x340.jpg'
            }, {
                firstName: 'John',
                lastName: 'Doe',
                title: 'Bad ass',
                img: 'http://themes.dfd.name/sunday/shortcodes/wp-content/uploads/2015/03/man_3-380x340.jpg'
            }, {
                firstName: 'John',
                lastName: 'Doe',
                title: 'Bad ass',
                img: 'http://themes.dfd.name/sunday/shortcodes/wp-content/uploads/2015/03/man_3-380x340.jpg'
            }, {
                firstName: 'John',
                lastName: 'Doe',
                title: 'Bad ass',
                img: 'http://themes.dfd.name/sunday/shortcodes/wp-content/uploads/2015/03/man_3-380x340.jpg'
            }, {
                firstName: 'John',
                lastName: 'Doe',
                title: 'Bad ass',
                img: 'http://themes.dfd.name/sunday/shortcodes/wp-content/uploads/2015/03/man_3-380x340.jpg'
            }
        ]
    },
    {
        name: 'Bodaphone',
        field: 'Telecom',
        location: 'Capitala',
        employees: '100-500',
        description: 'Ad tantas instructior vituperatoribus pri, et per legendos reprimique, ad nemore consetetur vim. Libris voluptaria sit cu. Dicam consequat usu ut. In simul homero quodsi mea.',
        jobs: [
            { title: 'Job 1', location: 'Mars', date: '13-10-2008', level: 'beginner' },
            { title: 'Job 2', location: 'Mars', date: '13-10-2008', level: 'beginner' },
            { title: 'Job 3', location: 'Mars', date: '13-10-2008', level: 'beginner' },
            { title: 'Job 4', location: 'Mars', date: '13-10-2008', level: 'beginner' },
            { title: 'Job 5', location: 'Mars', date: '13-10-2008', level: 'beginner' },
        ],
        team: [
            {
                firstName: 'John',
                lastName: 'Doe',
                title: 'Bad ass',
                img: 'http://themes.dfd.name/sunday/shortcodes/wp-content/uploads/2015/03/man_3-380x340.jpg'
            }, {
                firstName: 'John',
                lastName: 'Doe',
                title: 'Bad ass',
                img: 'http://themes.dfd.name/sunday/shortcodes/wp-content/uploads/2015/03/man_3-380x340.jpg'
            }, {
                firstName: 'John',
                lastName: 'Doe',
                title: 'Bad ass',
                img: 'http://themes.dfd.name/sunday/shortcodes/wp-content/uploads/2015/03/man_3-380x340.jpg'
            }, {
                firstName: 'John',
                lastName: 'Doe',
                title: 'Bad ass',
                img: 'http://themes.dfd.name/sunday/shortcodes/wp-content/uploads/2015/03/man_3-380x340.jpg'
            }, {
                firstName: 'John',
                lastName: 'Doe',
                title: 'Bad ass',
                img: 'http://themes.dfd.name/sunday/shortcodes/wp-content/uploads/2015/03/man_3-380x340.jpg'
            }
        ]
    }
];

const CompaniesListHOC = compose(
    withState('data', null, data),
    pure
);

export default CompaniesListHOC(CompaniesList);