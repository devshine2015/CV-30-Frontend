import UsersList from './component';
import { compose, pure, withState, withHandlers } from 'recompose';
import { withRouter } from 'react-router-dom';

const users = [
    {
        firstName: 'John',
        lastName: 'Doe',
        featuredArticles:
            [
                {
                    img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
                    title: 'Article 1'
                },
                {
                    img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
                    title: 'Article 1'
                },
                {
                    img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
                    title: 'Article 1'
                },
                {
                    img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
                    title: 'Article 1'
                },
                {
                    img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
                    title: 'Article 1'
                },
                {
                    img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
                    title: 'Article 1'
                },
            ],
        skills: [
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] }
        ],
        values: [
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] }
        ],
        hasAvatar: true,
    }, {
        firstName: 'John',
        lastName: 'Doe',
        featuredArticles:
            [
                {
                    img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
                    title: 'Article 1'
                },
                {
                    img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
                    title: 'Article 1'
                },
                {
                    img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
                    title: 'Article 1'
                },
                {
                    img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
                    title: 'Article 1'
                },
                {
                    img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
                    title: 'Article 1'
                },
                {
                    img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
                    title: 'Article 1'
                },
            ],
        skills: [
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] }
        ],
        values: [
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] }
        ],
        hasAvatar: true,
    }, {
        firstName: 'John',
        lastName: 'Doe',
        featuredArticles:
            [
                {
                    img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
                    title: 'Article 1'
                },
                {
                    img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
                    title: 'Article 1'
                },
                {
                    img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
                    title: 'Article 1'
                },
                {
                    img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
                    title: 'Article 1'
                },
                {
                    img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
                    title: 'Article 1'
                },
                {
                    img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
                    title: 'Article 1'
                },
            ],
        skills: [
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] }
        ],
        values: [
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] }
        ],
        hasAvatar: true,
    }, {
        firstName: 'John',
        lastName: 'Doe',
        featuredArticles:
            [
                {
                    img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
                    title: 'Article 1'
                },
                {
                    img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
                    title: 'Article 1'
                },
                {
                    img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
                    title: 'Article 1'
                },
                {
                    img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
                    title: 'Article 1'
                },
                {
                    img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
                    title: 'Article 1'
                },
                {
                    img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
                    title: 'Article 1'
                },
            ],
        skills: [
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] }
        ],
        values: [
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] }
        ],
        hasAvatar: true,
    }, {
        firstName: 'John',
        lastName: 'Doe',
        featuredArticles:
            [
                {
                    img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
                    title: 'Article 1'
                },
                {
                    img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
                    title: 'Article 1'
                },
                {
                    img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
                    title: 'Article 1'
                },
                {
                    img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
                    title: 'Article 1'
                },
                {
                    img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
                    title: 'Article 1'
                },
                {
                    img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
                    title: 'Article 1'
                },
            ],
        skills: [
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] }
        ],
        values: [
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] },
            { id: '1234', i18n: [{ title: 'Leadership' }] }
        ],
        hasAvatar: true,
    }
];
const UsersListHOC = compose(
    withRouter,
    withState('data', null, users),
    pure
);
export default UsersListHOC(UsersList);