import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import Loader from '../../../components/Loader';
import ArticleItem from './articleItem';

const FeedArticlesList = ({ feedArticlesQuery, feedArticlesKey }) => {
    const actualFeedArticlesKey = feedArticlesKey || 'feedArticles';
    const feedArticles = feedArticlesQuery[actualFeedArticlesKey];

    const articles = feedArticles ? feedArticles.edges.map(edge => edge.node) : [];
    const hasNextPage = feedArticles ? feedArticles.pageInfo.hasNextPage : false;

    return (
        !feedArticlesQuery.loading ?
        <section className='articlesList'>
            <InfiniteScroll
                pageStart={0}
                loadMore={() =>
                    feedArticlesQuery.fetchMore({
                        variables: {
                            after: feedArticles.edges[feedArticles.edges.length - 1].cursor
                        },
                        updateQuery: (previousResult, { fetchMoreResult: { [actualFeedArticlesKey]: { edges: newEdges, pageInfo} } }) => {
                            //console.log(newEdges, previousResult[actualFeedArticlesKey]);
                            return newEdges.length
                                ? {
                                    // Put the new articles at the end of the list and update `pageInfo`
                                    [actualFeedArticlesKey]: {
                                        __typename: previousResult[actualFeedArticlesKey].__typename,
                                        edges: [...previousResult[actualFeedArticlesKey].edges, ...newEdges],
                                        pageInfo
                                    }
                                }
                                : previousResult;
                        }
                    })}
                hasMore={hasNextPage}
                loader={<Loader key='loader'/>}
                useWindow={true}
            >
                {articles.map((article) => <ArticleItem article={article} key={article.id} refetch={feedArticlesQuery.refetch} />)}
            </InfiniteScroll>
        </section>
        : <Loader />
    );
}

export default FeedArticlesList;