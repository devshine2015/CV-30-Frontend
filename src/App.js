import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { IntlProvider, addLocaleData } from "react-intl";
import { graphql } from "react-apollo";
import { compose, pure } from "recompose";

import LandingPage from "./pages/landingPage";

import Navigation from "./components/navigation";

import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import ForgotPassword from "./pages/auth/forgot";
import ActivateAccount from "./pages/auth/activate";

import Contact from "./pages/contact";
import NewsFeed from "./pages/feed/";
import UserProfile from "./pages/users/userProfile";
import UserProfileSettings from "./pages/users/settings";
import Brand from "./pages/companies/brand";
import Team from "./pages/companies/team";
import Jobs from "./pages/jobs/list";
import Job from "./pages/jobs/view";
import NewJob from "./pages/jobs/new";
import UsersList from "./pages/users/list";
import CompaniesList from "./pages/companies/list";
import NewCompany from "./pages/companies/new";
import CompanySettings from "./pages/companies/settings";
import Article from "./pages/articles/view";
import NewArticle from "./pages/articles/new";

import ProtectedRoute from "./components/ProtectedRoute";
import Feedback from "./components/Feedback";

//translation stuff
import romanian from "react-intl/locale-data/ro";
import english from "react-intl/locale-data/en";

import messages_ro from "./translations/ro.json";
import messages_en from "./translations/en.json";

import { getLanguageQuery } from "./store/queries/locals";
import "./App.css";

addLocaleData([...romanian, ...english]);
const messages = {
	ro: messages_ro,
	en: messages_en
};

const CVRouter = props => {
	const {
		langaugeData: { loading, language: { code: language } = {} }
	} = props;
	if (loading) return null;
	var pathname = props.location.pathname;
	const renderRoute = () => {
		if (pathname.indexOf("/" + language) === -1) {
			pathname = pathname.replace(language === "ro" ? "en" : "ro", language);
			
			return <Redirect to={pathname} />;
		}
	};
	return (
		<IntlProvider locale={language} messages={messages[language]}>
			<React.Fragment>
				<Navigation {...props} />
				<Switch>
					{renderRoute()}
					<Route
						exact
						path="/:lang(en|ro)"
						component={LandingPage}
						{...props}
					/>
					<Route exact path="/:lang(en|ro)/login" component={Login} />
					<Route exact path="/:lang(en|ro)/register" component={Register} />
					<Route exact path="/:lang(en|ro)/forgot" component={ForgotPassword} />
					<Route exact path="/:lang(en|ro)/contact" component={Contact} />
					<Route
						exact
						path="/:lang(en|ro)/activate/:activationCode"
						component={ActivateAccount}
					/>

					<Route path="/:lang(en|ro)/news" exact component={NewsFeed} />
					<Route
						exact
						path="/:lang(en|ro)/companies"
						component={CompaniesList}
					/>
					<ProtectedRoute
						exact
						path="/:lang(en|ro)/companies/new"
						component={NewCompany}
					/>
					<ProtectedRoute
						exact
						path="/:lang(en|ro)/company/:companyId/settings"
						component={CompanySettings}
					/>
					<Route path="/:lang(en|ro)/company/:companyId" component={Brand} />
					<Route path="/:lang(en|ro)/team/:teamId" component={Team} />
					<Route path="/:lang(en|ro)/jobs" exact component={Jobs} />
					<ProtectedRoute
						path="/:lang(en|ro)/jobs/new"
						exact
						component={NewJob}
					/>
					<Route path="/:lang(en|ro)/job/:jobId" exact component={Job} />
					<Route path="/:lang(en|ro)/people" exact component={UsersList} />
					<Route
						exact
						path="/:lang(en|ro)/profile/feed"
						component={UserProfile}
					/>

					<Route
						path="/:lang(en|ro)/profile/:profileId"
						component={UserProfile}
					/>
					<Route path="/:lang(en|ro)/article/:articleId" component={Article} />
					<Route path="/:lang(en|ro)/articles/new" component={NewArticle} />

					<ProtectedRoute
						exact
						path="/:lang(en|ro)/myProfile/settings"
						component={UserProfileSettings}
					/>
					<Route path="/:lang(en|ro)/myProfile/" component={UserProfile} />
				</Switch>
				<Feedback />
			</React.Fragment>
		</IntlProvider>
	);
};

const CVRouterHOC = compose(
	graphql(getLanguageQuery, { name: "langaugeData" }),
	pure
);

const App = () => {
	return (
		<BrowserRouter>
			<Switch>
				<Route path="/:lang(en|ro)" component={CVRouterHOC(CVRouter)} />
				<Route
					path="/:segment(login|register|forgot|activate)"
					component={props => (
						<Redirect
							to={`/${navigator.language.substr(
								0,
								2
							)}/${props.location.pathname.replace(/^\/+/, "")}`}
						/>
					)}
				/>
				<Redirect from="/" to={"/en"} />
			</Switch>
		</BrowserRouter>
	);
};

export default App;
