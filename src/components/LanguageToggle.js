import React from 'react'
import { FormGroup, FormLabel } from '@material-ui/core'
import { compose, withHandlers, pure } from 'recompose'
import { graphql } from 'react-apollo'
// import { FormattedMessage } from 'react-intl'

import { setLanguageMutation, getLanguageQuery } from '../store/queries/locals';

const LanguageToggleHOC = compose (
    graphql( setLanguageMutation, { name: 'setLanguage'}),
    graphql( getLanguageQuery, { name: 'languageData'}),
    withHandlers({
        switchLanguageMode: ( { setLanguage, languageData: { language: { code }}}) => async() => {
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
    }),
    pure
)

const LanguageToggle = ({switchLanguageMode, languageData: { language: { code } = {} }}) => (
    <FormGroup row className='langaugeToggle'>
        <FormLabel className={code === "ro" ? 'active' : ''} onClick={switchLanguageMode}>ro</FormLabel>
        <span className="separator">|</span>
        <FormLabel className={code === "en" ? 'active' : ''} onClick={switchLanguageMode}>en</FormLabel>
    </FormGroup>
)

export default LanguageToggleHOC(LanguageToggle)