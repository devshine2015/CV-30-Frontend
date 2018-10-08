// import React from 'react';
import  { AutoSuggestField } from './FormHOCs';
import suggestions from '../constants/locations';
import { mapProps } from 'recompose';

export default mapProps(props => ({ ...props, suggestions, name: props.name || 'location', i18nId: props.i18nid || 'location.inputTexts' }))(AutoSuggestField);