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
    withState('count', 'setCount', headerStories.length - 1),
    withState('activeStoryItem', 'setActiveStoryItem', 0),
    withState('headerSoftSkills', 'setHeaderSoftSkills', softSkills),
    withState('headerValues', 'setHeaderValues', values),
    withHandlers({
        prevStoryItem: ({ activeStoryItem, setActiveStoryItem, count }) => () => {
            let prevStory = activeStoryItem - 1 < 0 ? count : activeStoryItem - 1;
            setActiveStoryItem(prevStory);
        },
        nextStoryItem: ({ activeStoryItem, setActiveStoryItem, count }) => () => {
            let nextStory = activeStoryItem + 1 > count ? 0 : activeStoryItem + 1;
            setActiveStoryItem(nextStory);
        },
        jumpToStoryItem: ({ setActiveStoryItem }) => (story) => {
            setActiveStoryItem(story);
        }
    }),
    pure
);

export default UserProfileHOC(UserProfile);