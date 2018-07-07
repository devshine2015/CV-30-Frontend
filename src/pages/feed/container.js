import NewsFeed from './component';
import { compose, withState, withHandlers, pure } from 'recompose';

const NewsFeedHOC = compose(
    withState('formData', 'setFormData', {}),
    withState('isArticle', 'updateIsArticle', false),
    withHandlers({
        handleFormChange: props => event => {
            const target = event.currentTarget;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;
            if (!name) {
                throw Error('Field must have a name attribute!');
            }
            props.setFormData(state => ({ ...state, [name]: value }));
        },
        switchIsArticle: ({ isArticle, updateIsArticle }) => () => {
            updateIsArticle(!isArticle);
        }
    }),
    pure
);

export default NewsFeedHOC(NewsFeed);