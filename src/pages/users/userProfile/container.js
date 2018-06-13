import UserProfile from './component';
import { compose, pure, withState, withHandlers } from 'recompose';
import { withRouter } from 'react-router-dom';

const userProfileData = {
    headerStories: [
        {
            img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
            title: 'Story 1'
        },
        {
            img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
            title: 'Story 2 this is a longer title'
        },
        {
            img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
            title: 'Story 3 bla bla'
        }
    ],
    availableColors: [
        {
            name: 'Red',
            style: 'red'
        },
        {
            name: 'Gradient 1',
            style: 'linear-gradient(to right, #23225a 0%, #1a1abc 100%)'
        },
        {
            name: 'Gradient 1',
            style: 'linear-gradient(to right, #7756a2 0%, #1f1f1c 100%)'
        },
        {
            name: 'Gradient 1',
            style: 'blue'
        },
        {
            name: 'Gradient 1',
            style: 'linear-gradient(to right, #21ab5a 0%, #7cca12 100%)'
        },
        {
            name: 'Gradient 1',
            style: 'linear-gradient(to right, #32aba5 0%, #7cca42 100%)'
        }
    ],
    softSkills: ['leadership', 'grit', 'critical thinking', 'gritt', 'outspoken', 'extrovert', 'bla bla', 'bla bla bla'],
    values: ['leadership', 'grit', 'critical thinking'],
    experience: [
        {
            position: 'President',
            company: 'USA',
            description: 'bla bla bla bla bla',
            startDate: '2018-11-12',
            stillWorkThere: true,
            location: 'White House'
        },
        {
            position: 'President',
            company: 'USA',
            description: 'bla bla bla bla bla',
            startDate: '2018-11-12',
            stillWorkThere: true,
            location: 'White House'
        }
    ],
    projects: [
        {
            position: 'President',
            company: 'USA',
            description: 'bla bla bla bla bla',
            startDate: '2018-11-12',
            stillWorkThere: true,
            location: 'White House'
        },
        {
            position: 'President',
            company: 'USA',
            description: 'bla bla bla bla bla',
            startDate: '2018-11-12',
            stillWorkThere: true,
            location: 'White House'
        }
    ],
    contact: {
        phoneNo: '0-123-4567',
        address: 'Some Street 123',
        fb: 'https://facebook.com'
    },
    myStory: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    isSalaryPublic: true,
    desiredSalary: 100
}

const UserProfileHOC = compose(
    withRouter,
    withState('data', 'setData', userProfileData),
    withState('editMode', 'updateEditMode', false),
    withHandlers({
        switchEditMode: ({ editMode, updateEditMode }) => () => {
            updateEditMode(!editMode);
        }
    }),
    pure
);

export default UserProfileHOC(UserProfile);