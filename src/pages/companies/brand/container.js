import Brand from './component';
import { compose, pure, withState, withHandlers } from 'recompose';
import { withRouter } from 'react-router-dom';


const company = {
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
        },
        {
            img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
            title: 'Story 4 bla bla'
        },
        {
            img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
            title: 'Story 4 bla bla'
        },
    ],
    keyWords: ['telecomunicatii', 'bucuresti', '100-500 angajati']
};


const BrandHOC = compose(
    withRouter,
    withState('data', 'setData', company),
    withState('editMode', 'updateEditMode', false),
    withHandlers({
        switchEditMode: ({ editMode, updateEditMode }) => () => {
            updateEditMode(!editMode);
        }
    }),
    pure
);
export default BrandHOC(Brand);
