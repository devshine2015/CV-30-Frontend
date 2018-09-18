import React from 'react';
import { IconButton, Icon } from '@material-ui/core';
import ReactPlayer from 'react-player';

import { s3BucketURL } from '../../constants/s3';
import { stripHtmlTags } from '../../constants/utils';

const ArticleSlider = props => {
    const { articles, title, prevItem, activeItem, jumpToItem, nextItem, editMode, editArticle, deleteArticle } = props;
    return (
        <div className='sliderRoot'>
            <div className='sliderHeader'>
                {title || null}
                {articles && articles.length > 1 &&
                    <div className='sliderControls'>
                        <IconButton className='sliderArrow' onClick={prevItem}>
                            <Icon>arrow_back_ios</Icon>
                        </IconButton>
                        {
                            articles.map((article, index) =>
                                (<span className={index === activeItem ? 'sliderDot active' : 'sliderDot'} key={article.id} onClick={() => jumpToItem(index)}></span>)
                            )
                        }

                        <IconButton className='sliderArrow' onClick={nextItem}>
                            <Icon>arrow_forward_ios</Icon>
                        </IconButton>
                    </div>
                }
            </div>
            <div className='sliderMain'>
                {
                    articles && articles.map((article, index) => {
                        let image, video;

                        if (article.images && article.images.length > 0)
                            image = `${s3BucketURL}${article.images[0].path}`;

                        if (article.videos && article.videos.length > 0)
                            video = article.videos[0].path;

                        return (
                            <div className={index === activeItem ? 'sliderContents active' : 'sliderContents'} key={article.id}>
                                <div className='media'>
                                    {image &&
                                        <img src={image} alt={article.id} className='articleImg' />
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
                                <div className='textContents'>
                                    <h4>{article.title}</h4>
                                    <p>{stripHtmlTags(article.description)}</p>
                                </div>
                                {editMode &&
                                    <React.Fragment>
                                        <IconButton className='floatingEditBtn' onClick={() => editArticle(article.id)}>
                                            <Icon>edit</Icon>
                                        </IconButton>
                                        <IconButton className='floatingDeleteBtn' onClick={() => deleteArticle(article.id)}>
                                            <Icon>close</Icon>
                                        </IconButton>
                                    </React.Fragment>
                                }
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default ArticleSlider;