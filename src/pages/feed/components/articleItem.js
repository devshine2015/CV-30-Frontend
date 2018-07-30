import React from 'react';
import { Button, Icon, IconButton } from '@material-ui/core';

import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import ArticleAuthorAvatar from './articleAuthorAvatar';

const ArticleItem = props => {
    const { match, article: { author, i18n, createdAt } } = props;
    const { title, description } = i18n[0];
    const { firstName, lastName, email } = author;
    const { lang } = match.params;
    const fullName = (firstName && lastName) ? `${firstName.charAt(0)}${lastName.charAt(0)}` : email;

    return (
        <div className='listItem userListItem'>
            <div className='leftOverlay'>
                <ArticleAuthorAvatar profile={author} lang={lang} />
                <div className='leftOverlayTexts'>
                    <h6 className='userName'>
                        <span>{fullName}</span>
                        <i className='fas fa-caret-down' />
                    </h6>
                    <p className='userTitle'>Manager</p>
                </div>
            </div>
            <span className='articleDate'>{new Date(createdAt).toLocaleDateString()}</span>
            <div className='rightOverlay'>
                Works at&nbsp;<span className='highlight'>CV30</span>&nbsp;-&nbsp;<span className='highlight'>Marketing team</span>
            </div>
            <div className='itemBody'>
                <p className='articleBody'>
                    <span className='articleTitle'>{title}</span> &nbsp;
                    {description}
                </p>
                <div className='articleMedia'>
                </div>
                <div className='socialSection'>
                    <div className='comments'>
                        <span className='counter'>3 Comments</span>
                        <Button className='commentBtn' disableRipple>
                            <span className="fa-stack">
                                <i className="fas fa-comment-alt fa-2x"></i>
                                <i className="fas fa-plus fa-stack-1x fa-inverse"></i>
                            </span>
                            Comment
                        </Button>
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