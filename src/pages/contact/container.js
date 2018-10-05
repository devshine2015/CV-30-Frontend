import { compose , pure } from 'recompose'
import { withRouter } from 'react-router-dom'
import Contact from './component'

const ContactHOC = compose (
    withRouter,
    pure
)

export default ContactHOC(Contact)