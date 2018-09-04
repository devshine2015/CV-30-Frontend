import Slider from './component';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { setEditMode } from '../../store/queries';

const SliderHOC = compose(
    withRouter,
    graphql(setEditMode, { name: 'setEditMode' }),
    withState('activeItem', 'setItem', 0),
    withState('count', null, ({ articles }) => articles ? articles.length - 1 : 0),
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
        },
        editArticle: ({ setEditMode, history, match: { params: { lang } } }) => async id => {
            await setEditMode({
                variables: {
                    status: true
                }
            });
            return history.push(`/${lang}/article/${id}`);
        }
    }),
    pure
);

export default SliderHOC(Slider);
