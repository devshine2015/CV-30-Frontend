import UserProfile from './component';
import { compose, pure, withState, withHandlers } from 'recompose';
import { withRouter } from 'react-router-dom';

const headerStories = [
    {
        img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
        title: 'Story 1'
    },
    {
        img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
        title: 'Story 2 this is a longer title'
    },
    {
        img: 'https://cdn.psychologytoday.com/sites/default/files/styles/image-article_inline_full/public/field_blog_entry_teaser_image/people%20laughing_0.jpg',
        title: 'Story 3 bla bla'
    },
];

const availableColors = [
    {
        name: 'Red',
        style: 'red'
    },
    {
        name: 'Gradient 1',
        style: 'linear-gradient(to right, #23225a 0%, #1a1abc 100%)'
    },
    {
        name: 'Gradient 1',
        style: 'linear-gradient(to right, #7756a2 0%, #1f1f1c 100%)'
    },
    {
        name: 'Gradient 1',
        style: 'blue'
    },
    {
        name: 'Gradient 1',
        style: 'linear-gradient(to right, #21ab5a 0%, #7cca12 100%)'
    },
    {
        name: 'Gradient 1',
        style: 'linear-gradient(to right, #32aba5 0%, #7cca42 100%)'
    }
]

const softSkills = ['leadership', 'grit', 'critical thinking', 'gritt', 'outspoken', 'extrovert', 'bla bla', 'bla bla bla'];

const values = ['leadership', 'grit', 'critical thinking'];

const experience = [
    {
        position: 'President',
        company: 'USA',
        description: 'bla bla bla bla bla',
        startDate: '2018-11-12',
        stillWorkThere: true,
        location: 'White House'
    },
    {
        position: 'President',
        company: 'USA',
        description: 'bla bla bla bla bla',
        startDate: '2018-11-12',
        stillWorkThere: true,
        location: 'White House'
    }
];

const contact = {
    phoneNo: '0-123-4567',
    address: 'Some Street 123',
    fb: 'https://facebook.com'
};
const myStory = `Vel at ferri homero aliquando, pro ex elitr patrioque. Quando dicant veniam ea nam. No sea cibo interpretaris, vix reque errem ea. Id ius ridens maluisset dissentiunt, quo et autem etiam abhorreant. Mei te audiam intellegat conclusionemque, no labore impedit instructior cum. Pri id homero expetendis, cu nec melius feugait comprehensam. Ex tota corpora vivendum has, cum at dolorum expetenda urbanitas, mel ut rebum ornatus.
                Vidisse discere ius at, sed ex nibh integre. Malorum aliquando mediocritatem vix in, ea legimus epicuri sententiae sed. Eu qui nisl expetenda. Mundi adolescens id est, habeo comprehensam ex est. Ius atqui referrentur contentiones ad, te eum alia tacimates, per minimum insolens explicari ut. Eu vel saepe quidam.
                Legere utroque epicuri ad mei. Ad splendide honestatis qui, sit summo laboramus te. At eos docendi delectus imperdiet. Vide fugit vel an. Atqui ocurreret definitionem an nam, ne quo dicta evertitur, wisi constituam eos ad. Stet probo efficiantur ne cum.`

const UserProfileHOC = compose(
    withRouter,
    withState('headerStories', 'setHeaderStories', headerStories),
    withState('count', 'setCount', headerStories.length - 1),
    withState('activeStoryItem', 'setActiveStoryItem', 0),
    withState('headerSoftSkills', 'setHeaderSoftSkills', softSkills),
    withState('headerValues', 'setHeaderValues', values),
    withState('editMode', 'updateEditMode', false),
    withState('availableColors', null, availableColors),
    withState('colorPickerAnchor', 'setColorPickerAnchor', null),
    withState('skillsAnchor', 'setSkillsAnchor', null),
    withState('skillsModalData', 'setSkillsModalData', null),
    withState('experience', null, experience),
    withState('contact', null, contact),
    withState('myStory', null, myStory),
    withHandlers({
        prevStoryItem: ({ activeStoryItem, setActiveStoryItem, count }) => () => {
            let prevStory = activeStoryItem - 1 < 0 ? count : activeStoryItem - 1;
            setActiveStoryItem(prevStory);
        },
        nextStoryItem: ({ activeStoryItem, setActiveStoryItem, count }) => () => {
            let nextStory = activeStoryItem + 1 > count ? 0 : activeStoryItem + 1;
            setActiveStoryItem(nextStory);
        },
        jumpToStoryItem: ({ setActiveStoryItem }) => (story) => {
            setActiveStoryItem(story);
        },
        switchEditMode: ({ editMode, updateEditMode }) => () => {
            updateEditMode(!editMode);
        },
        toggleColorPicker: ({ setColorPickerAnchor }) => (event) => {
            setColorPickerAnchor(event.target);
        },
        closeColorPicker: ({ setColorPickerAnchor }) => () => {
            setColorPickerAnchor(null);
        },
        openSkillsModal: ({ headerSoftSkills, headerValues, setSkillsAnchor, setSkillsModalData }) => (type, target) => {
            if (type === 'values')
                setSkillsModalData(headerValues);
            if (type === 'skills')
                setSkillsModalData(headerSoftSkills);
            setSkillsAnchor(target);
        },
        closeSkillsModal: ({ setSkillsAnchor }) => () => {
            setSkillsAnchor(null);
        },
        uploadImage: () => () => { },
        removeStory: ({ headerStories, setHeaderStories }) => index => {
            debugger;
            let stories = [...headerStories];
            stories.splice(index, 1);
            setHeaderStories(stories);
        }
    }),
    pure
);

export default UserProfileHOC(UserProfile);