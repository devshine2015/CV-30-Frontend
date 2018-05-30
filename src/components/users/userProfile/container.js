import UserProfile from './component';
import { compose, pure, withState, withHandlers } from 'recompose';
import { withStyles } from '@material-ui/core';
import styles from './style';

const headerStories = [
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
    },
];

const softSkills = ['leadership', 'grit', 'critical thinking', 'gritt', 'outspoken', 'extrovert', 'bla bla', 'bla bla bla'];

const values = ['leadership', 'grit', 'critical thinking'];

const UserProfileHOC = compose(
    withStyles(styles),
    withState('headerStories', 'setHeaderStories', headerStories),
    withState('headerSoftSkills', 'setHeaderSoftSkills', softSkills),
    withState('headerValues', 'setHeaderValues', values),
    pure
);

export default UserProfileHOC(UserProfile);