import Brand from './component';
import { compose, pure, withState, withHandlers } from 'recompose';
import { withRouter } from 'react-router-dom';

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
    {
        img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
        title: 'Story 4 bla bla'
    },
    {
        img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
        title: 'Story 4 bla bla'
    },
];

const keyWords = ['telecomunicatii', 'bucuresti', '100-500 angajati'];

const BrandHOC = compose(
    withRouter,
    withState('keyWords', 'setHeaderKeywords', keyWords),
    withState('headerStories', 'setHeaderStories', headerStories),
    withState('count', 'setCount', headerStories.length - 1),
    pure
);
export default BrandHOC(Brand);
