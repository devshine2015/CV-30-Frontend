import React from 'react';
import { Button, Icon, IconButton } from '@material-ui/core';
import { withRouter, Link } from 'react-router-dom';
import { compose, withState, withHandlers, pure } from 'recompose';
import { CommentCount } from 'disqus-react';
import ReactPlayer from 'react-player';
import { graphql } from 'react-apollo';

import AuthorAvatarHeader from './authorAvatarHeader';
import { disqusShortname, disqusUrlPrefix } from '../../../constants/disqus';
import { stripHtmlTags } from '../../../constants/utils';
import { s3BucketURL } from '../../../constants/s3';
import { getCurrentUser, handleArticleTag, getNewsFeedArticles } from '../../../store/queries';
import AddTag from './addTag';
import Loader from '../../../components/Loader';
import EditPost from './editPost';

const ArticleItemHOC = compose(
    withRouter,
    graphql(getCurrentUser, { name: 'getCurrentUser' }),
    graphql(handleArticleTag, { name: 'handleArticleTag' }),
    withState('editPost', 'setEditPost', false),
    withState('tagAnchor', 'setTagAnchor', null),
    withHandlers({
        openTagEditor: ({ setTagAnchor }) => target => {
            setTagAnchor(target);
        },
        closeTagEditor: ({ setTagAnchor }) => () => {
            setTagAnchor(null);
        },
        addVote: ({ handleArticleTag, match: { params: { lang: language } }, article }) => async tag => {
            console.log(article);
            try {
                await handleArticleTag({
                    variables: {
                        language,
                        details: {
                            title: tag.i18n[0].title,
                            articleId: article.id,
                            isSet: true
                        }
                    },
                    refetchQueries: [{
                        query: getNewsFeedArticles,
                        fetchPolicy: 'network-only',
                        name: 'newsFeedArticlesQuery',
                        variables: {
                            language
                        }
                    }]
                });
            }
            catch (err) {
                console.log(err);
            }
        },
        openEditPost: ({ setEditPost }) => () => setEditPost(true),
        closeEditPost: ({ setEditPost }) => () => setEditPost(false)
    }),
    pure
);

const ArticleItem = props => {
    const {
        match, getCurrentUser,
        article: { id, author, isPost, i18n, createdAt, images, videos, tags, endorsers },
        openTagEditor, closeTagEditor, tagAnchor, addVote,
        editPost, openEditPost, closeEditPost
    } = props;

    if (getCurrentUser.loading)
        return <Loader />;

    const { auth: { currentUser } } = getCurrentUser;
    const isAddTagAllowed = !!currentUser;
    const { title, description } = i18n[0];
    const { lang } = match.params;

    let desc = stripHtmlTags(description);
    if (!isPost)
        desc = desc.substring(0, 200) + ' ...';

    const disqusConfig = {
        url: `${disqusUrlPrefix}/${lang}/article/${id}`,///#disqus_thread`,
        identifier: id,
        title: title
    };

    let image, video;
    if (images && images.length > 0) {
        image = `${s3BucketURL}${images[0].path}`;
    }
    if (videos && videos.length > 0) {
        video = videos[0].path;
    }

    const appreciatedCount = tags ? tags.reduce((acc, cur) => acc + cur.users.length, 0) : 0;

    const canEditPost = isPost && currentUser.id === author.id;

    return (
        <div className='listItem userListItem'>
            <AuthorAvatarHeader profile={author} lang={lang} />
            <span className='articleDate'>{new Date(createdAt).toLocaleDateString()}</span>
            <div className='rightOverlay'>
                Works at&nbsp;<span className='highlight'>CV30</span>&nbsp;-&nbsp;<span className='highlight'>Marketing team</span>
            </div>

            <div className='itemBody'>
                <p className='articleBody'>
                    {!isPost &&
                        <React.Fragment>
                            <span className='articleTitle'>{title}</span> &nbsp;
                        </React.Fragment>
                    }
                    {!editPost && desc}
                    {!isPost && <Link to={`/${lang}/article/${id}`} className='readMoreLink'>Read more</Link>}
                    {(canEditPost && !editPost) &&
                        <IconButton className='floatingEditBtn' onClick={openEditPost}>
                            <Icon>edit</Icon>
                        </IconButton>
                    }
                </p>
                {editPost &&
                    <EditPost
                        article={props.article}
                        closeEditor={closeEditPost}
                    />
                }
                {(image || video) &&
                    <div className='articleMedia'>
                        {image &&
                            <img src={image} alt={id} className='articleImg' />
                        }
                        {(video && !image) &&
                            <ReactPlayer
                                url={video}
                                width='100%'
                                height='100%'
                                config={{
                                    youtube: {
                                        playerVars: {
                                            showinfo: 0,
                                            controls: 0,
                                            modestbranding: 1,
                                            loop: 1
                                        }
                                    }
                                }}
                                playing={false} />
                        }
                    </div>
                }
                <div className='socialSection'>
                    <div className='comments'>
                        {/* <span className='counter'>3 Comments</span> */}
                        <CommentCount shortname={disqusShortname} config={disqusConfig}>
                            0 Comments
                        </CommentCount>

                        <Link to={`/${lang}/article/${id}`} style={{ textDecoration: 'none' }}>
                            <Button className='commentBtn' disableRipple>
                                <span className="fa-stack">
                                    <i className="fas fa-comment-alt fa-2x"></i>
                                    <i className="fas fa-plus fa-stack-1x fa-inverse"></i>
                                </span>
                                Comment
                            </Button>
                        </Link>
                    </div>

                    <p className='likes'>Appreciated {appreciatedCount} time{appreciatedCount !== 1 && "s"}.</p>

                    <div className='tags'>
                        {
                            isAddTagAllowed &&
                            <IconButton className='addTagBtn' onClick={event => openTagEditor(event.target)}>
                                <Icon>add</Icon>
                            </IconButton>
                        }
                        {
                            (tags && tags.length > 0) && tags.map(tag => {
                                const { id, i18n, users } = tag;
                                const result = users.find(user => user.id === currentUser.id);
                                let userHasVoted = !!result;
                                return (
                                    <span className='tag' key={id}>
                                        {
                                            userHasVoted ?
                                                <span className='votes'>{tag.users.length}</span>
                                                : <IconButton className='voteBtn' onClick={() => addVote(tag)}>
                                                    <Icon>add</Icon>
                                                </IconButton>
                                        }
                                        <span className='title'>{i18n[0].title}</span>
                                    </span>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <AddTag
                tagAnchor={tagAnchor}
                closeTagEditor={closeTagEditor}
                articleId={id}
            />
        </div>
    );
}

export default ArticleItemHOC(ArticleItem);