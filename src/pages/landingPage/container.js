import { compose, pure, withState, withHandlers } from 'recompose';
import LandingPage from './component';
import { graphql } from 'react-apollo';
import { landingPage } from '../../store/queries';
import { withRouter } from 'react-router-dom';

const stories = [
    {
        id: '1234',
        images: [{
            id: '1234',
            path: 'http://www.karwaanhost.com/wp-content/uploads/2018/02/want16267-1LYtUU1405187665.jpg'
        }],
        videos: [],
        i18n: [{
            title: 'Test article 1 goes here',
            description: 'Lorem ipsum dolor sit amet, doming dignissim usu ea, vel ex amet quot. Et lobortis intellegat vituperatoribus usu, ut populo qualisque eos. Pro civibus insolens referrentur cu, nec regione volumus recusabo ea. Summo commodo an eam, cu sea mazim principes reformidans, no eam euismod voluptua appetere.'
        }]
    },
    {
        id: '2341',
        images: [{
            id: '1234',
            path: 'http://static1.squarespace.com/static/534c1abee4b0fdaf5ae3efec/t/535721e1e4b0f52fccfc58ec/1424537201904'
        }],
        videos: [],
        i18n: [{
            title: 'Test article 2 goes here',
            description: 'Cu verear liberavisse pri, per quod dolor quaeque at. Meis graeco adversarium cum cu. Per sumo duis ne, eu ignota nemore quo. Nihil soluta eam ne, hinc fugit usu ex. Eam debitis urbanitas et, id pri malis dolor.'
        }]
    },
    {
        id: '2134',
        images: [],
        videos: [{
            id: '1234',
            path: 'https://www.youtube.com/watch?v=vzgSo8B_9eE'
        }],
        i18n: [{
            title: 'Test article 3 goes here',
            description: 'Pro vitae eruditi facilis ne. Usu ei libris legimus deseruisse, id usu corpora appetere, malorum consectetuer ex eam. Sale putent oblique et eam. Has et populo nominati repudiandae. Id errem labores usu, vero ridens per ut. Ea vix novum nostrum.'
        }]
    },
    {
        id: '4321',
        images: [{
            id: '1234',
            path: 'https://img.maximummedia.ie/joe_ie/eyJkYXRhIjoie1widXJsXCI6XCJodHRwOlxcXC9cXFwvbWVkaWEtam9lLm1heGltdW1tZWRpYS5pZS5zMy5hbWF6b25hd3MuY29tXFxcL3dwLWNvbnRlbnRcXFwvdXBsb2Fkc1xcXC8yMDE3XFxcLzExXFxcLzA1MjE1NjU2XFxcL2dob3N0LXN0b3JpZXMuanBnXCIsXCJ3aWR0aFwiOjc2NyxcImhlaWdodFwiOjQzMSxcImRlZmF1bHRcIjpcImh0dHBzOlxcXC9cXFwvd3d3LmpvZS5pZVxcXC9hc3NldHNcXFwvaW1hZ2VzXFxcL2pvZVxcXC9uby1pbWFnZS5wbmc_dj01XCJ9IiwiaGFzaCI6IjgzNzk3NGU3N2U4MzRlZTIwYmJhZGQ3MTE4MzMxNGVmMWYxYTJlZDIifQ==/ghost-stories.jpg'
        }],
        videos: [],
        i18n: [{
            title: 'Test article 4 goes here',
            description: `Nonumes quaerendum mediocritatem at nam, per tantas vivendo te. Munere platonem senserit sit ne, mei libris forensibus id. Illum apeirian tacimates mei eu. Cu legere luptatum voluptaria mea, per ad corrumpit repudiare. Id mei nemore consequat. Ius democritum appellantur referrentur te.

Id eos omnis singulis evertitur. Movet facete singulis quo ea, ne iusto laudem fabulas pro, inani dolorum mel eu. In vis omnesque quaestio deseruisse. Ei putent salutandi dissentiet mel, ne odio elitr nobis sea. Vix eu detracto voluptua nominati, duo errem platonem et. Nec semper recusabo dissentiet ad, eu cum quot simul soleat.`
        }]
    },
];

const LandingPageHOC = compose(
    withRouter,
    graphql(landingPage, {
        name: 'landingPage',
        options: props => ({
            fetchPolicy: 'network-only',
            variables: {
                language: props.match.params.lang
            },
        }),
    }),
    withState('stories', 'setStories', stories),
    withState('editMode', 'updateEditMode', true),
    withHandlers({
        switchEditMode: ({ editMode, updateEditMode }) => () => {
            updateEditMode(!editMode);
        }
    }),
    pure
);

export default LandingPageHOC(LandingPage);