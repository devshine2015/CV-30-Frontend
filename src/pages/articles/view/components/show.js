import React from 'react';
import { Grid, Button, Icon, IconButton } from '@material-ui/core';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { DiscussionEmbed } from 'disqus-react';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { Sentry } from 'react-activity';
import 'react-activity/dist/react-activity.css';

import AuthorAvatarHeader from '../../../../components/AvatarHeader/AuthorAvatarHeader';
import { disqusShortname, disqusUrlPrefix } from '../../../../constants/disqus';
import AddTags from './addTags';
import { appreciateMutation } from '../../../../store/queries';

const ArticleShowHOC = compose(
    withState('state', 'set', {
        tagAnchor: null,
        fetching: false
    }),
    graphql(appreciateMutation, { name: 'appreciate' }),
    withHandlers({
        openTagEditor: ({ set }) => target => set(state => ({ ...state, target })),
        closeTagEditor: ({ set }) => () => set(state => ({ ...state, target: null })),
        addVote: ({ set, appreciate, getArticle: { article: { id: articleId } }, match: { params: { lang: language } } }) => tagId => {
            set(state => ({ ...state, fetching: true }), async () => {
                try {
                    await appreciate({
                        variables: {
                            tagId,
                            articleId
                        }
                    });
                }
                catch (err) {
                    console.log(err);
                }
                set(state => ({ ...state, fetching: false }));
            })
        },
    }),
    pure
);

const ArticleShow = props => {
    const {
        match,
        getArticle: { article },
        currentUser: { auth: { currentUser } },
        openTagEditor, closeTagEditor, state: { tagAnchor, fetching }, addVote
    } = props;

    const {
        id: articleId,
        title, description: articleBody, createdAt, tags
    } = article;

    let likes = tags ? tags.reduce((acc, cur) => acc + cur.votes, 0) : 0;
    const isAddTagAllowed = !!currentUser;

    const disqusConfig = {
        url: disqusUrlPrefix + match.url,
        identifier: articleId,
        title: title,
    };
    const { lang } = match.params;
    console.log('xxxxxx');
    return (
        <Grid container className='mainBody articleShow'>
            <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                <h1 className='acticleTitle'>{title}</h1>
                <div className='articleBody' dangerouslySetInnerHTML={{ __html: articleBody }} />
                <div className='disqusThread'>
                    <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
                </div>
            </Grid>
            <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'>
                <div className='columnRightContent'>
                    <div className='authorAvatar'>
                        <AuthorAvatarHeader article={article} lang={lang} />
                    </div>
                    <FormattedDate value={createdAt}>
                        {(text) => (<p className='articleDate'>{text}</p>)}
                    </FormattedDate>
                    <section className='likesSection'>
                        <FormattedMessage id={likes <= 1 ? 'appreciations.singular' : 'appreciations.plural'} defaultMessage="Likes" description="Likes">
                            {(text) => (
                                <p className='likes'>
                                    <span className='count'>{likes}</span>&nbsp;{text}
                                </p>
                            )}
                        </FormattedMessage>
                        {
                            isAddTagAllowed &&
                            <React.Fragment>
                                <Button className='likeBtn' disableRipple onClick={event => openTagEditor(event.target)}>
                                    <Icon className='icon'>add</Icon>
                                    <FormattedMessage id='article.likeBtn' defaultMessage="Compliment your own way" description="Compliment" >
                                        {(text) => (<span className='text'>{text}</span>)}
                                    </FormattedMessage>
                                </Button>
                                <AddTags
                                    tagAnchor={tagAnchor}
                                    closeTagEditor={closeTagEditor}
                                    articleId={articleId}
                                    tags={tags}
                                />
                            </React.Fragment>
                        }
                    </section>
                    {(tags && tags.length > 0) &&
                        <section className='tags'>
                            {
                                tags.map(({ id, title, votes, canVote }) => (
                                    <span className='tag' key={id}>
                                        {
                                            !canVote ?
                                                <span className='votes'>{votes}</span>
                                                : (
                                                    fetching
                                                    ? <Sentry color="#727981" size={14} speed={1} animating={true} />
                                                    : <IconButton className='voteBtn' onClick={() => addVote(id)}>
                                                        <Icon>add</Icon>
                                                    </IconButton>
                                                )
                                        }
                                        <span className='title'>{title}</span>
                                    </span>
                                ))
                            }
                        </section>
                    }
                </div>
            </Grid>
        </Grid>
    );
}

export default ArticleShowHOC(ArticleShow); 