import { compose, pure, withState } from 'recompose';
import LandingPage from './component';

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
    withState('stories', 'setStories', stories),
    pure
)

export default LandingPageHOC(LandingPage);