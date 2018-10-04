import React from 'react'
import { FormGroup, FormLabel, Switch } from '@material-ui/core'
import { compose, withHandlers, pure } from 'recompose'
import { graphql } from 'react-apollo'
import { FormattedMessage } from 'react-intl'

import { setRomanianMode, getRomanianMode } from '../store/queries'

const LanguageToggleHOC = compose (
    graphql( setRomanianMode, { name: 'setRomanianMode'}),
    graphql( getRomanianMode , { name: 'getRomanianMode'}),
    withHandlers({
        switchLanguageMode: ( { setRomanianMode, getRomanianMode: { romanianMode: {status}}}) => async() =>{
            try {
                await setRomanianMode ({
                    variables: {
                        status: !status
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

const LanguageToggle = ({switchLanguageMode, getRomanianMode: { romanianMode: { status } = {status: false}}}) => (
    <FormGroup row className='editToggle'>
        <FormLabel className={status? 'active' : ''} style={{ marginLeft: '10px' }} onClick={switchLanguageMode}>ro</FormLabel>
        {/* <Switch checked={!status} onChange={switchLanguageMode}
            classes={{
                switchBase: 'colorSwitchBase',
                checked: 'colorChecked',
                bar: 'colorBar',
            }}
            color="primary"/> */}
        <FormLabel className={!status ? 'active' : ''} style={{ marginLeft: '10px' }} onClick={switchLanguageMode}>en</FormLabel>
    </FormGroup>
)

export default LanguageToggleHOC(LanguageToggle)