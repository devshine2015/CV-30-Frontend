import { compose, pure, withState, withHandlers } from 'recompose';
import { withStyles } from '@material-ui/core';
import LandingPage from './component';
import styles from './style';

const stories = [
    {
        title: 'Title 1',
        text: 'Text 1',
        image: 'http://wowslider.com/sliders/demo-11/data/images/krasivyi_korabl_-1024x768.jpg'
    },
    {
        title: 'Title 2',
        text: 'Text 2',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwObBmWDaXK4DxechC-rdwErL199LKP6qTC_oIh-5LeoOX-NMC'
    },
    {
        title: 'Title 3',
        text: 'Text 3',
        image: 'http://ukphotosgallery.com/wp-content/uploads/2016/05/bg3.jpg'
    },
    {
        title: 'Title 4',
        text: 'Text 4',
        image: 'https://www.w3schools.com/howto/img_forest.jpg'
    }
];

const LandingPageHOC = compose(
    withStyles(styles),
    withState('stories', 'setStories', stories),
    withState('count', 'setCount', stories.length - 1),
    withState('activeStoryItem', 'setActiveStoryItem', 0),
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
)

export default LandingPageHOC(LandingPage);