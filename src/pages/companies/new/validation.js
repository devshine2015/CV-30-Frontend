const yup = require('yup');

module.exports = yup.object().shape({
    name: yup.string().trim().required().max(255),
    noOfEmployees: yup.string().trim().required().max(255),
    location: yup.string().trim().required().max(255),
    industry: yup.string().trim().min(2).max(255).required()
})