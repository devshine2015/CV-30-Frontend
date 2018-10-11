import * as yup from 'yup';

export default yup.object().shape({
    id: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
    companyId: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
    teamId: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i).required('Please choose a team'),
    title: yup.string().trim().max(255).required('Please enter a title.'),
    description: yup.string().trim(),
    idealCandidate: yup.string().trim(),
    phone: yup.string().trim().max(255).nullable(),
    email: yup.string().trim().max(255).nullable(),
    facebook: yup.string().trim().max(255).nullable(),
    linkedin: yup.string().trim().max(255).nullable(),
    expireDate: yup.date().default(new Date()).min(new Date(), 'Cannot expire in the past.'),
    location: yup.string().trim().max(255),
    jobTypes: yup.array().of(yup.number().positive().integer()),
    salary: yup.object().shape({
        amountMin: yup.number().positive().required().lessThan(yup.ref('amountMax')),
        amountMax: yup.number().positive().required(),
        currency: yup.string().required().matches(/(ron|eur)/, { excludeEmptyString: true }),
        isPublic: yup.boolean().required()
    }),
    activityField: yup.string().trim().max(255),
    imagePath: yup.string().trim().max(1024).nullable(),
    videoUrl: yup.string().trim().max(1024).nullable()
        .matches(/^(http(s)??:\/\/)?(www\.)?((youtube\.com\/watch\?v=)|(youtu.be\/))([a-zA-Z0-9\-_])+/, 'Video URL does not match YouTube.'),
    skills: yup.array().of(
        yup.number().positive().integer()
    ),
    status: yup.string().matches(/(draft|active|archived)/, { excludeEmptyString: true })
});

