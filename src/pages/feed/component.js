import React from 'react';
import { Grid, TextField } from '@material-ui/core';

import Loader from '../../components/Loader';
import ArticlesList from './components/articlesList';
import { Link } from 'react-router-dom';
import NewPost from './components/newPost';

const NewsFeed = props => {
    const {
        currentProfileQuery: { loading, profile },
        newsFeedArticlesQuery,
        match: { params: { lang } }
    } = props;


    if (loading || newsFeedArticlesQuery.loading)
        return <Loader />

    const followingArticles = newsFeedArticlesQuery.newsFeedArticles ? newsFeedArticlesQuery.newsFeedArticles.following : [];

    return (
        <div className='newsFeedRoot'>
            <Grid container className='mainBody brandShow'>
                <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                    {(profile && profile.id) && <NewPost profile={profile} />}
                    {(profile && profile.id) &&
                        <section className='profileActions'>
                            <div className='profileAction company'>
                                <h3>
                                    Conecteaza-ti compania cu urmatorul tau angajat
                            </h3>
                                <p>
                                    Lorem ipsum dolor sit amet, eu his scripta perpetua. Falli movet prompta has in...
                                </p>
                                <Link to={`/${lang}/companies/new`} className='profileActionLink'>
                                    Adauga o companie
                                </Link>
                            </div>
                            <div className='profileAction networking'>
                                <h3>
                                    Completeaza-ti proﬁlul pentru Networking!
                                </h3>
                                <p>
                                    Lorem ipsum dolor sit amet, eu his scripta perpetua. Falli movet prompta has in...
                                </p>
                                <Link to={`/${lang}/myProfile/settings`} className='profileActionLink'>
                                    Completeaza-ti proﬁlul
                                </Link>
                            </div>
                            <div className='profileAction jobs'>
                                <h3>
                                    Urmatorul tau job te asteapta.
                                </h3>
                                <p>
                                    Lorem ipsum dolor sit amet, eu his scripta perpetua. Falli movet prompta has in...
                                </p>
                                <Link to={`/${lang}/jobs`} className='profileActionLink'>
                                    Mergi la Joburi
                                </Link>
                            </div>
                        </section>
                    }
                    <section className='articlesList'>
                        <ArticlesList articles={followingArticles} />
                    </section>
                </Grid>
                <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'>
                    <div className='columnRightContent'>
                        <div className='fixed'>
                            <section className='searchFields'>
                                <TextField
                                    name='generalSearch'
                                    label='Keywords, people or companies'
                                    placeholder='Search for keywords, people or companies...'
                                    type="search"
                                    className='textField'
                                    fullWidth
                                />
                                <TextField
                                    name='hastags'
                                    label='#hashtags'
                                    placeholder='Search for hastags...'
                                    type="search"
                                    className='textField'
                                    fullWidth
                                />
                            </section>
                            <section className='promo'>
                                <span>Promo</span>
                            </section>
                            <section className='links'>
                                <p className='copyright'>Copyright © 2018 CV30. All rights reserved </p>
                                <Link to={``}>About Us</Link>
                                <Link to={``}>Terms and Conditions</Link>
                                <Link to={``}>Q&A</Link>
                            </section>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}

export default NewsFeed;