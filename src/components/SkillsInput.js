import React from "react";

import { compose, pure } from "recompose";
import { injectIntl } from "react-intl";
import { graphql } from "react-apollo";

import { skillsQuery } from "../store/queries";
import AutoCompleteSelectInput from "./AutoCompleteSelectInput";

const SkillsInputHOC = compose(
    pure,
    graphql(skillsQuery, {
        name: 'skillsQuery',
        options: () => ({
            fetchPolicy: 'network-only'
        }),
    }),
    injectIntl,
    pure
);

const SkillsInput = props => {
    const { skillsQuery } = props;

    if (skillsQuery.loading || !skillsQuery.skills) return <div>Skills...</div>;

    const { value, onChange, intl, label, placeholder } = props;

    const suggestions = skillsQuery.skills.map(skill => ({
        value: skill.id,
        label: intl.formatMessage({ id: `skills.${skill.key}` })
    }));

    return (
        <AutoCompleteSelectInput
            label={label || 'Skills'}
            placeholder={placeholder || 'Select Skills...'}
            isMulti
            value={value.map(item => suggestions.find(el => el.value === item))}
            onChange={val => onChange(val.map(item => item.value))}
            suggestions={suggestions}
        />
    )
}

export default SkillsInputHOC(SkillsInput);