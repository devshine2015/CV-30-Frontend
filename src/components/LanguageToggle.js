import React from 'react'
import { FormGroup, FormLabel } from '@material-ui/core'
import { compose, withHandlers, pure } from 'recompose'
import { graphql } from 'react-apollo'
// import { FormattedMessage } from 'react-intl'

import { setLanguageMutation, getLanguageQuery } from '../store/queries/locals';

const LanguageItem = compose(
    pure,
    graphql( setLanguageMutation, { name: 'setLanguage'}),
    graphql( getLanguageQuery, { name: 'languageData'}),
    withHandlers({
        switchLanguageMode: ( { language, setLanguage, languageData: { language: { code }}}) => async () => {
            if (code === language) return;
            try {
                await setLanguage ({
                    variables: {
                        code: code === "ro" ? "en" : "ro"
                    }
                })
            }
            catch (err) {
                console.log(err)
            }
        }
    })
)(({ language, isActive, switchLanguageMode, languageData: { language: { code }} }) => <FormLabel className={language === code ? 'active' : ''} onClick={switchLanguageMode}>{language}</FormLabel>)

const LanguageToggle = () => (
    <FormGroup row className='langaugeToggle'>
        <LanguageItem language="ro" />
        <span className="separator">|</span>
        <LanguageItem language="en" />
    </FormGroup>
)

export default LanguageToggle;