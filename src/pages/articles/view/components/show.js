import React from 'react';
import { Grid, Button, Icon, IconButton } from '@material-ui/core';
import ReactPlayer from 'react-player';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { DiscussionEmbed } from 'disqus-react';
import { compose, withState, withHandlers, pure } from 'recompose';

import { s3BucketURL } from '../../../../constants/s3';
import AuthorAvatarHeader from '../../../../components/AvatarHeader/AuthorAvatarHeader';
import { disqusShortname, disqusUrlPrefix } from '../../../../constants/disqus';
import AddTags from './addTags';

const ArticleShowHOC = compose(
    withState('tagAnchor', 'setTagAnchor', null),
    withHandlers({
        openTagEditor: ({ setTagAnchor }) => target => setTagAnchor(target),
        closeTagEditor: ({ setTagAnchor }) => () => setTagAnchor(null),
    }),
    pure
);

const ArticleShow = props => {
    const {
        match,
        getArticle: { article },
        currentUser: { auth: { currentUser } },
        openTagEditor, closeTagEditor, tagAnchor, addVote
    } = props;

    const {
        id: articleId,
        images, videos, i18n, createdAt, tags
    } = article;

    let title = (i18n && i18n[0] && i18n[0].title) ? i18n[0].title : '';
    let articleBody = (i18n && i18n[0] && i18n[0].description) ? i18n[0].description : '';

    let image, video;
    if (images && images.length > 0) {
        image = `${s3BucketURL}${images[0].path}`;
    }
    if (videos && videos.length > 0) {
        video = videos[0].path;
    }

    let likes = tags ? tags.reduce((acc, cur) => acc + cur.users.length, 0) : 0;
    const isAddTagAllowed = !!currentUser;

    const disqusConfig = {
        url: disqusUrlPrefix + match.url,
        identifier: articleId,
        title: title,
    };
    const { lang } = match.params;

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
                                tags.map(tag => {
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
                        </section>
                    }
                </div>
            </Grid>
        </Grid>
    );
}

export default ArticleShowHOC(ArticleShow); 