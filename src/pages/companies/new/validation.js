const yup = require('yup');

module.exports = yup.object().shape({
    name: yup.string().trim().required().max(255),
    noOfEmployees: yup.string().trim().required().max(255),
    location: yup.string().trim().required().max(255),
    industryId: yup.number().positive().integer().required()
})