import React from 'react';

import ArticleItem from './articleItem';

const articlesList = props => {
    return (
        <section className='articlesList'>
            {props.articles.length > 0 && props.articles.map((article) => (<ArticleItem article={article} key={article.id} />))}
        </section>
    );
}

export default articlesList;