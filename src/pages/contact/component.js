import React from 'react'
import { FormattedMessage } from 'react-intl'

const Contact =  props => {
    console.log("-------------- Contact ----------------")
    return (
        <div id="contactPage" className='contactPageRoot'>
            <FormattedMessage id="contact.title" defaultMessage="Contact" description="Contact Title Header">
                {(text) => (
                    <h1>{text}</h1>
                )}
            </FormattedMessage>
            
            <FormattedMessage id="contact.content" defaultMessage="Content" description="Contact Content">
                {(text) => (
                    <div>
                        {text.split("\n").map((i,key) => {
                            return <div key={key}><p>{i}</p></div>;
                        })}
                    </div>
                )}
            </FormattedMessage>
        </div>
    )
    
}

export default Contact