import React from 'react';
import { Button, Icon, IconButton } from '@material-ui/core';
import { withRouter, Link } from 'react-router-dom';
import { compose, withState, withHandlers, pure } from 'recompose';
import { CommentCount } from 'disqus-react';
import ReactPlayer from 'react-player';
import { graphql } from 'react-apollo';
import { Sentry } from 'react-activity';
import 'react-activity/dist/react-activity.css';

import AuthorAvatarHeader from '../../../components/AvatarHeader/AuthorAvatarHeader';
import { disqusShortname, disqusUrlPrefix } from '../../../constants/disqus';
import { stripHtmlTags } from '../../../constants/utils';
import { s3BucketURL } from '../../../constants/s3';
import { getCurrentUser, appreciateMutation, setEditMode } from '../../../store/queries';
import AddTag from './addTag';
import Loader from '../../../components/Loader';
import EditPost from './editPost';

const ArticleItemHOC = compose(
    withRouter,
    graphql(getCurrentUser, { name: 'getCurrentUser' }),
    graphql(appreciateMutation, { name: 'appreciate' }),
    graphql(setEditMode, { name: 'setEditMode' }),
    withState('state', 'set', {
        editPost: false,
        tagAnchor: null,
        fetching: false
    }),
    withHandlers({
        openTagEditor: ({ set }) => tagAnchor => set(state => ({ ...state, tagAnchor })),
        closeTagEditor: ({ set }) => () => set(state => ({ ...state, tagAnchor: null })),
        addVote: ({ set, appreciate, article: { id: articleId }, refetch }) => tagId => {
            set(state => ({ ...state, fetching: true }), async () => {
                try {
                    await appreciate({
                        variables: {
                            tagId,
                            articleId
                        }
                    });
                    await refetch();
                }
                catch (err) {
                    console.log(err);
                }
                set(state => ({ ...state, fetching: false }));
            });
        },
        handleEditBtnClick: props => async () => {
            const { set, article: { id, isPost }, history, setEditMode, match: { params: { lang } } } = props;
            if (isPost) set(state => ({ ...state, editPost: true }));
            else {
                await setEditMode({
                    variables: {
                        status: true
                    }
                });
                return history.push(`/${lang}/article/${id}`);
            }
        },
        closeEditPost: ({ set }) => () => set(state => ({ ...state, editPost: false }))
    }),
    pure
);

const ArticleItem = props => {
    const {
        state: {
            editPost,
            tagAnchor,
            fetching
        },
        match, getCurrentUser,
        article,
        openTagEditor, closeTagEditor, addVote,
        handleEditBtnClick, closeEditPost,
        refetch
    } = props;

    if (getCurrentUser.loading)
        return <Loader />;

    const { auth: { currentUser } } = getCurrentUser;
    const isAddTagAllowed = !!currentUser;
    const { lang } = match.params;
    const { id, author, isPost, title, description, createdAt, images, videos, tags } = article;

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
        images.forEach(img => {
            if (img.isFeatured)
                image = `${s3BucketURL}${img.path}`;
        });
    }

    if (videos && videos.length > 0) {
        videos.forEach(vid => {
            if (vid.isFeatured)
                video = vid.path;
        });
    }

    const appreciatedCount = tags ? tags.reduce((acc, cur) => acc + cur.votes, 0) : 0;

    const canEdit = currentUser && currentUser.id === author.id;

    return (
        <div className='listItem userListItem'>
            <div className='leftOverlay'>
                <AuthorAvatarHeader article={article} lang={lang} />
            </div>
            <span className={canEdit ? 'articleDate editable' : 'articleDate'}>{new Date(createdAt).toLocaleDateString()}</span>
            <div className={canEdit ? 'rightOverlay editable' : 'rightOverlay'}>
                Works at&nbsp;<span className='highlight'>THEIR</span>&nbsp;-&nbsp;<span className='highlight'>FUTURE</span>
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
                        refetch={refetch}
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
                                const { id, title, votes, canVote } = tag;
                                return (
                                    <span className='tag' key={id}>
                                        {
                                            !canVote || !currentUser ?
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
                tags={tags}
                refetch={refetch}
            />
        </div>
    );
}

export default ArticleItemHOC(ArticleItem);