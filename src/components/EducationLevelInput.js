// import React from 'react';
import  { AutoSuggestField } from './FormHOCs';
import suggestions from '../constants/educationLevels';
import { mapProps } from 'recompose';

export default mapProps(props => ({ ...props, suggestions, name: props.name || 'position', i18nId: props.i18nid || 'education.inputTexts' }))(AutoSuggestField);