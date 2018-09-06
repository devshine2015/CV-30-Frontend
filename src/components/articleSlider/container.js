import Slider from './component';
import { compose, withState, withHandlers, pure, lifecycle } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { setEditMode } from '../../store/queries';

const SliderHOC = compose(
    withRouter,
    graphql(setEditMode, { name: 'setEditMode' }),
    withState('activeItem', 'setItem', 0),
    withHandlers({
        prevItem: ({ activeItem, setItem, articles }) => () => {
            let prevStory = activeItem - 1 < 0 ? articles.length - 1 : activeItem - 1;
            setItem(prevStory);
        },
        nextItem: ({ activeItem, setItem, articles }) => () => {
            let nextStory = activeItem + 1 > articles.length - 1 ? 0 : activeItem + 1;
            setItem(nextStory);
        },
        jumpToItem: ({ setItem }) => index => {
            setItem(index);
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
    lifecycle({
        componentDidUpdate(prevProps) {
            if (prevProps.articles.length !== this.props.articles.length)
                this.props.setItem(0);
        }
    }),
    pure
);

export default SliderHOC(Slider);
