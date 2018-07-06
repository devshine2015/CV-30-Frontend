const yup = require('yup');

module.exports = yup.object().shape({
    name: yup.string().trim().required().max(255),
    activityField: yup.string().trim().required().max(255),
    noOfEmployees: yup.string().trim().required().max(255),
    location: yup.string().trim().required().max(255),
    place: yup.object().shape({
        addressComponents: yup.string().trim().nullable(),
        formattedAddress: yup.string().trim().nullable(),
        latitude: yup.number().nullable(),
        longitude: yup.number().nullable(),
        international_phone_number: yup.string().trim().nullable(),
        name: yup.string().trim().nullable(),
        placeId: yup.string().trim().nullable(),
        compoundCode: yup.string().trim().nullable(),
        globalCode: yup.string().trim().nullable(),
        rating: yup.number().nullable().min(0).max(5),
        reviews: yup.string().trim().nullable(),
        types: yup.string().trim().nullable(),
        googleUrl: yup.string().trim().nullable(),
        website: yup.string().trim().nullable()
    })
})