import React from 'react';

import ArticleItem from './articleItem';

const articlesList = ({ articles }) => (
    articles && articles.map((article) => <ArticleItem article={article} key={article.id} />)
);

export default articlesList;