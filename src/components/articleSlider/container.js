import Slider from './component';
import { compose, withState, withHandlers, pure } from 'recompose';

const SliderHOC = compose(
    withState('activeItem', 'setItem', 0),
    withState('count', null, ({ articles }) => articles.length - 1),
    withHandlers({
        prevItem: ({ activeItem, setItem, count }) => () => {
            let prevStory = activeItem - 1 < 0 ? count : activeItem - 1;
            setItem(prevStory);
        },
        nextItem: ({ activeItem, setItem, count }) => () => {
            let nextStory = activeItem + 1 > count ? 0 : activeItem + 1;
            setItem(nextStory);
        },
        jumpToItem: ({ setItem }) => (story) => {
            setItem(story);
        }
    }),
    pure
);

export default SliderHOC(Slider);
