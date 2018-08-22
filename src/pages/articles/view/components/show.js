import React from 'react';
import { Grid, Avatar, Button, Icon } from '@material-ui/core';
import ReactPlayer from 'react-player';
import { FormattedDate, FormattedMessage, FormattedTime } from 'react-intl';
import { DiscussionEmbed } from 'disqus-react';

import { s3BucketURL } from '../../../../constants/s3';
import Loader from '../../../../components/Loader';
import Comment from './comment';
import { disqusShortname, disqusUrlPrefix } from '../../../../constants/disqus';

const ArticleShow = props => {
    const { match, getArticle: { loading, article: { id: articleId, author: { id: authorId, email, firstName, lastName, position }, images, videos, i18n, created_at } } } = props;

    if (loading)
        return <Loader />

    let title = (i18n && i18n[0] && i18n[0].title) ? i18n[0].title : '';
    let articleBody = (i18n && i18n[0] && i18n[0].description) ? i18n[0].description : '';

    let image, video;
    if (images && images.length > 0) {
        image = `${s3BucketURL}${images[0].path}`;
    }
    if (videos && videos.length > 0) {
        video = videos[0].path;
    }
    let avatar /*= hasAvatar ? `${s3BucketURL}/${profilesFolder}/${authorId}/avatar.${avatarContentType}` : defaultUserAvatar*/;
    let fullName = (firstName && lastName) ? `${firstName} ${lastName}` : email;
    let likes = 123;

    const disqusConfig = {
        url: disqusUrlPrefix + match.url,
        identifier: articleId,
        title: title,
    };

    const comments = [{}, {}];

    return (
        <Grid container className='mainBody articleShow'>
            <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                <h1 className='acticleTitle'>{title}</h1>
                <div className='media'>
                    {image &&
                        <img src={image} alt={articleId} className='storyImg' />
                    }
                    {(video && !image) &&
                        <ReactPlayer
                            url={video}
                            width='200'
                            height='140'
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
                <div className='articleBody' dangerouslySetInnerHTML={{ __html: articleBody }} />
                <div className='disqusThread'>
                    <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
                </div>
            </Grid>
            <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'>
                <div className='columnRightContent'>
                    <div className='author'>
                        <Avatar alt={firstName || lastName || email} src={avatar} className='avatar' />
                        <div className='texts'>
                            <h6 className='userName'>
                                <span>{fullName}</span>
                                <i className='fas fa-caret-down' />
                            </h6>
                            <p className='userTitle'>{position}</p>
                        </div>
                    </div>
                    <FormattedDate value={created_at}>
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
                        <Button className='likeBtn' disableRipple>
                            <Icon className='icon'>add</Icon>
                            <FormattedMessage id='article.likeBtn' defaultMessage="Compliment your own way" description="Compliment">
                                {(text) => (
                                    <span className='text'>{text}</span>
                                )}
                            </FormattedMessage>
                        </Button>
                    </section>
                    <section className='commentsSection'>
                        <FormattedMessage id={comments.length <= 1 ? 'comments.singular' : 'comments.plural'} defaultMessage="Comments" description="Comments">
                            {(text) => (
                                <p className='comments'>
                                    <span className='count'>{comments.length}</span>&nbsp;{text}
                                </p>
                            )}
                        </FormattedMessage>
                        {comments && comments.map(comment => <Comment comment={comment} />)}
                    </section>
                    <FormattedMessage id='comment.action' defaultMessage="Comment" description="Comment">
                        {(text) => (
                            <Button className='addCommentBtn'>
                                <Icon className='icon'>chat_bubble</Icon>
                                {text}
                            </Button>
                        )}
                    </FormattedMessage>
                </div>
            </Grid>
        </Grid>
    );
}

export default ArticleShow; 