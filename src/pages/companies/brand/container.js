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
    keyWords: ['telecomunicatii', 'bucuresti', '100-500 angajati'],
    lifeAtTheOffice: [
        {
            img: 'http://www.petguide.com/wp-content/uploads/2016/10/yellow-bellied-slider.jpg',
            title: 'Story 1',
            text: ' Nam ne sint nonumy lobortis, docendi recusabo intellegat ut eam. Mel quas mucius tincidunt at. Cu bonorum voluptatum vel, in cum sumo legere blandit. Dolore libris nominati te quo, et elit probatus duo.Eu movet consulatu qui, fuisset forensibus mel ea, detracto legendos quo in.'
        },
        {
            img: 'http://www.petguide.com/wp-content/uploads/2016/10/yellow-bellied-slider.jpg',
            title: 'Story 2',
            text: ' Nam ne sint nonumy lobortis, docendi recusabo intellegat ut eam. Mel quas mucius tincidunt at. Cu bonorum voluptatum vel, in cum sumo legere blandit. Dolore libris nominati te quo, et elit probatus duo.Eu movet consulatu qui, fuisset forensibus mel ea, detracto legendos quo in.'
        },
        {
            img: 'http://www.petguide.com/wp-content/uploads/2016/10/yellow-bellied-slider.jpg',
            title: 'Story 3',
            text: ' Nam ne sint nonumy lobortis, docendi recusabo intellegat ut eam. Mel quas mucius tincidunt at. Cu bonorum voluptatum vel, in cum sumo legere blandit. Dolore libris nominati te quo, et elit probatus duo.Eu movet consulatu qui, fuisset forensibus mel ea, detracto legendos quo in.'
        },
        {
            img: 'http://www.petguide.com/wp-content/uploads/2016/10/yellow-bellied-slider.jpg',
            title: 'Story 4',
            text: ' Nam ne sint nonumy lobortis, docendi recusabo intellegat ut eam. Mel quas mucius tincidunt at. Cu bonorum voluptatum vel, in cum sumo legere blandit. Dolore libris nominati te quo, et elit probatus duo.Eu movet consulatu qui, fuisset forensibus mel ea, detracto legendos quo in.'
        }
    ],
    moreStories: [
        {
            id: 1,
            img: 'http://www.petguide.com/wp-content/uploads/2016/10/yellow-bellied-slider.jpg',
            title: 'Story 1',
            text: ' Nam ne sint nonumy lobortis, docendi recusabo intellegat ut eam. Mel quas mucius tincidunt at. Cu bonorum voluptatum vel, in cum sumo legere blandit. Dolore libris nominati te quo, et elit probatus duo.Eu movet consulatu qui, fuisset forensibus mel ea, detracto legendos quo in.'
        },
        {
            id: 2,
            img: 'http://www.petguide.com/wp-content/uploads/2016/10/yellow-bellied-slider.jpg',
            title: 'Story 2',
            text: ' Nam ne sint nonumy lobortis, docendi recusabo intellegat ut eam. Mel quas mucius tincidunt at. Cu bonorum voluptatum vel, in cum sumo legere blandit. Dolore libris nominati te quo, et elit probatus duo.Eu movet consulatu qui, fuisset forensibus mel ea, detracto legendos quo in.'
        },
        {
            id: 3,
            img: 'http://www.petguide.com/wp-content/uploads/2016/10/yellow-bellied-slider.jpg',
            title: 'Story 3',
            text: ' Nam ne sint nonumy lobortis, docendi recusabo intellegat ut eam. Mel quas mucius tincidunt at. Cu bonorum voluptatum vel, in cum sumo legere blandit. Dolore libris nominati te quo, et elit probatus duo.Eu movet consulatu qui, fuisset forensibus mel ea, detracto legendos quo in.'
        }
    ],
    faq: [
        {
            question: 'What is the question 1?',
            answer: 'Nam ne sint nonumy lobortis, docendi recusabo intellegat ut eam. Mel quas mucius tincidunt at. Cu bonorum voluptatum vel, in cum sumo legere blandit.Dolore libris nominati te quo, et elit probatus duo. Eu movet consulatu qui, fuisset forensibus mel ea, detracto legendos quo in.'
        },
        {
            question: 'What is the question 2?',
            answer: 'Nam ne sint nonumy lobortis, docendi recusabo intellegat ut eam.'
        },
        {
            question: 'What is the question 3?',
            answer: 'Nam ne sint nonumy lobortis, docendi recusabo intellegat ut eam. Mel quas mucius tincidunt at. Cu bonorum voluptatum vel, in cum sumo legere blandit.Dolore libris nominati te quo, et elit probatus duo.'
        },
        {
            question: 'What is the question 4?',
            answer: 'Nam ne sint nonumy lobortis, docendi recusabo intellegat ut eam. Mel quas mucius tincidunt at.'
        }
    ]
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
