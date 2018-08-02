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
import { getCurrentUser } from '../../../store/queries';
import AddTag from './addTag';
import Loader from '../../../components/Loader';

const ArticleItemHOC = compose(
    withRouter,
    graphql(getCurrentUser, { name: 'getCurrentUser' }),
    withState('tagAnchor', 'setTagAnchor', null),
    withHandlers({
        openTagEditor: ({ setTagAnchor }) => target => {
            setTagAnchor(target);
        },
        closeTagEditor: ({ setTagAnchor }) => () => {
            setTagAnchor(null);
        }
    }),
    pure
);

const ArticleItem = props => {
    const {
        match, getCurrentUser,
        article: { id, author, isPost, i18n, createdAt, images, videos, tags, endorsers }, openTagEditor, closeTagEditor, tagAnchor
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

    return (
        <div className='listItem userListItem'>
            <AuthorAvatarHeader profile={author} lang={lang} />
            <span className='articleDate'>{new Date(createdAt).toLocaleDateString()}</span>
            <div className='rightOverlay'>
                Works at&nbsp;<span className='highlight'>CV30</span>&nbsp;-&nbsp;<span className='highlight'>Marketing team</span>
            </div>
            <div className='itemBody'>
                <p className='articleBody'>
                    <span className='articleTitle'>{title}</span> &nbsp;
                    {desc}
                    {!isPost && <Link to={`/${lang}/article/${id}`} className='readMoreLink'>Read more</Link>}
                </p>
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
                            (tags && tags.length > 0) && tags.map(tag => (
                                <span className='tag' key={tag.id}>
                                    <span className='votes'>{tag.users.length}</span>
                                    <span className='title'>{tag.i18n[0].title}</span>
                                </span>
                            ))
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