import React from 'react';
import { Button, Icon, IconButton } from '@material-ui/core';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';
import { CommentCount } from 'disqus-react';

import AuthorAvatarHeader from './authorAvatarHeader';
import { disqusShortname, disqusUrlPrefix } from '../../../constants/disqus';
import { stripHtmlTags } from '../../../constants/utils';

const ArticleItem = props => {
    const { match, article: { id, author, i18n, createdAt } } = props;
    const { title, description } = i18n[0];
    const { lang } = match.params;

    let desc = stripHtmlTags(description).substring(0, 200) + ' ...';

    const disqusConfig = {
        url: `${disqusUrlPrefix}/${lang}/article/${id}`,///#disqus_thread`,
        identifier: id,
        title: title
    };

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
                    <Link to={`/${lang}/article/${id}`} className='readMoreLink'>Read more</Link>
                </p>
                <div className='articleMedia'>
                </div>
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
                    <p className='likes'>Appreciated 101 times.</p>
                    <div className='tags'>
                        <IconButton className='addTagBtn'>
                            <Icon>add</Icon>
                        </IconButton>
                        <span className='tag'>
                            <span className='votes'>125</span>
                            <span className='title'>Marketing</span>
                        </span>
                        <span className='tag'>
                            <span className='votes'>125</span>
                            <span className='title'>Marketing</span>
                        </span>
                        <span className='tag'>
                            <IconButton className='voteBtn'>
                                <Icon>add</Icon>
                            </IconButton>
                            <span className='title'>Marketing</span>
                        </span>
                        <span className='tag'>
                            <IconButton className='voteBtn'>
                                <Icon>add</Icon>
                            </IconButton>
                            <span className='title'>Marketing</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default compose(withRouter)(ArticleItem);