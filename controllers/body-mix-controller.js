const {BodyMix} = require('../Models/BodyMix');
const Joi = require('joi');

async function getBodyMixes(req, res) {
    const bodyMixes = await BodyMix
        .find()
        .populate({
            path: 'components.material',
            model: 'Material',
        });
    if(!bodyMixes) return res.status(404).send('getBodyMix not found!!');
    return res.send(bodyMixes);
}

async function createBodyMixes(req, res) {
    const {error} = validateBodyMix(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    let newBody = new BodyMix({
        code: req.body.code,
        type: req.body.type,
        components: req.body.components,
        createdAt: Date.now()
    });

    newBody = await newBody.save();

    const result = await BodyMix.populate(newBody, {
        path: 'components.material',
        model: 'Material'
    });

    return res.send(result);
}


async function updateBodyMixes(req, res) {
    const {error} = validateBodyMix(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const newBodyMix = await BodyMix.findByIdAndUpdate(req.params.id, {
        $set: {
            code: req.body.code,
            type: req.body.type,
            components: req.body.components
        }
    }, {new: true}).populate({
        path: 'components.material',
        model: 'Material',
    });
    
    return res.send(newBodyMix);
}

async function deleteBodyMixes(req, res) {
    const bodyMix = await BodyMix.findByIdAndRemove(req.params.id);
    if(!bodyMix) return res.status(404).send('Body Mix not found!!');

    return res.send(bodyMix);
}

function validateBodyMix(bookmark) {
    const componentsSchema = Joi.object().keys({
        _id:      Joi.string().optional(),
        material: Joi.string().required(),
        quantity: Joi.number().min(0).required(),
        moisture: Joi.number().min(0).required(),
        dryRM:    Joi.number().min(0).required(),
        wetRM:    Joi.number().min(0).required(),
        wet:      Joi.number().min(0).required(),

    });
    const schema = {
        _id: Joi.string().optional(),
        createdAt: Joi.string().optional(),
        code: Joi.string().trim().min(1).required(),
        type: Joi.string().trim().min(1).required(),
        components: Joi.array().items(componentsSchema).min(1).required()
    };

    return Joi.validate(bookmark, schema);
}


module.exports = {
    getBodyMixes,
    createBodyMixes,
    updateBodyMixes,
    deleteBodyMixes
};