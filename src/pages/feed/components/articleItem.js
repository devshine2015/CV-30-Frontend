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
import { getCurrentUser, handleArticleTags, getNewsFeedArticles, setEditMode } from '../../../store/queries';
import AddTag from './addTag';
import Loader from '../../../components/Loader';
import EditPost from './editPost';

const ArticleItemHOC = compose(
    withRouter,
    graphql(getCurrentUser, { name: 'getCurrentUser' }),
    graphql(handleArticleTags, { name: 'handleArticleTags' }),
    graphql(setEditMode, { name: 'setEditMode' }),
    withState('editPost', 'setEditPost', false),
    withState('tagAnchor', 'setTagAnchor', null),
    withHandlers({
        openTagEditor: ({ setTagAnchor }) => target => {
            setTagAnchor(target);
        },
        closeTagEditor: ({ setTagAnchor }) => () => {
            setTagAnchor(null);
        },
        addVote: ({ handleArticleTags, match: { params: { lang: language } }, article }) => async tag => {
            console.log(article);
            try {
                await handleArticleTags({
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
        handleEditBtnClick: props => async () => {
            const { setEditPost, article: { id, isPost }, history, setEditMode, match: { params: { lang } } } = props;
            if (isPost)
                setEditPost(true);
            else {
                await setEditMode({
                    variables: {
                        status: true
                    }
                });
                return history.push(`/${lang}/article/${id}`);
            }
        },
        closeEditPost: ({ setEditPost }) => () => setEditPost(false)
    }),
    pure
);

const ArticleItem = props => {
    const {
        match, getCurrentUser,
        article,
        openTagEditor, closeTagEditor, tagAnchor, addVote,
        editPost, handleEditBtnClick, closeEditPost
    } = props;

    if (getCurrentUser.loading)
        return <Loader />;

    const { auth: { currentUser } } = getCurrentUser;
    const isAddTagAllowed = !!currentUser;
    const { lang } = match.params;
    const { id, author, isPost, i18n, createdAt, images, videos, tags } = article;
    const { title, description } = i18n[0];

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

    const canEdit = currentUser && currentUser.id === author.id;

    return (
        <div className='listItem userListItem'>
            <AuthorAvatarHeader article={article} lang={lang} />
            <span className={canEdit ? 'articleDate editable' : 'articleDate'}>{new Date(createdAt).toLocaleDateString()}</span>
            <div className={canEdit ? 'rightOverlay editable' : 'rightOverlay'}>
                Works at&nbsp;<span className='highlight'>CV30</span>&nbsp;-&nbsp;<span className='highlight'>Marketing team</span>
            </div>
            {(canEdit && !editPost) &&
                <IconButton className='floatingEditBtn' onClick={handleEditBtnClick}>
                    <Icon>edit</Icon>
                </IconButton>
            }
            <div className='itemBody'>
                <p className='articleBody'>
                    {!isPost &&
                        <React.Fragment>
                            <span className='articleTitle'>{title}</span> &nbsp;
                        </React.Fragment>
                    }
                    {!editPost && desc}
                    {!isPost && <Link to={`/${lang}/article/${id}`} className='readMoreLink'>Read more</Link>}

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