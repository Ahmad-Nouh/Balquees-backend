const {ProductCard} = require('../Models/ProductCard');
const Joi = require('joi');
const multer = require('multer');
const STORAGE = process.env.STORAGE;
const parseJson = require('../middlewares/parser');

async function getProductCards(req, res) {
    const productCard = await ProductCard
    .find()
    .populate({
        path: 'paintMix',
        model: 'PaintMix'
    })
    .populate({
        path: 'engobMix',
        model: 'EngobMix'
    })
    .populate({
        path: 'bodyMix',
        model: 'BodyMix'
    });

    if(!productCard) return res.status(404).send('getProductCard not found!!');
    return res.send(productCard);
}


async function createProductCard(req, res) {

    let newProductCard = {
        productName:    req.body.productName,
        code:           req.body.code,
        type:           req.body.type,
        glize:          req.body.glize,
        productionDate: req.body.productionDate,
        dimensions:     req.body.dimensions,
        bOvenHeat:      req.body.bOvenHeat,
        pOvenHeat:      req.body.pOvenHeat,
        bOvenPeriod:    +req.body.bOvenPeriod,
        pOvenPeriod:    +req.body.pOvenPeriod,
        engobFactors:   req.body.engobFactors,
        paintFactors:   req.body.paintFactors,
        pistonPressure: +req.body.pistonPressure,
        thickness:      +req.body.thickness,
        breakingForce:  +req.body.breakingForce,
        radiation:     +req.body.radiation,

        paintMix:       req.body.paintMix,
        engobMix:       req.body.engobMix,
        bodyMix:        req.body.bodyMix,
        createdAt:  Date.now()
    };

    console.log('newProductCard ', newProductCard);

    // if product card has an image
    if (req.file) {
        const index = req.file.destination.indexOf(STORAGE) + STORAGE.length;
        const imagePath = `${req.file.destination.substring(index)}/${req.file.filename}`;
        newProductCard.imageUrl = imagePath;
    }


    // validate product cards
    const {error} = validateProductCard(newProductCard);
    if(error) return res.status(400).send(error.details[0].message);

    let productCard = new ProductCard(newProductCard);
    productCard = await productCard.save();

    let result = await ProductCard
        .populate(productCard, {
            path: 'paintMix',
            model: 'PaintMix'
        });

    result = await ProductCard.populate(result, {
        path: 'engobMix',
        model: 'EngobMix'
    });

    result = await ProductCard.populate(result, {
        path: 'bodyMix',
        model: 'BodyMix'
    });

    return res.send(result);
}

async function updateProductCard(req, res) {
    let newProductCard = await ProductCard.findById(req.params.id);
    if(!newProductCard) return res.status(404).send('Product Card not found!!');

    newProductCard.productName=         req.body.productName;
    newProductCard.code=                req.body.code;
    newProductCard.type=                req.body.type;
    newProductCard.glize=               req.body.glize;
    newProductCard.productionDate=      req.body.productionDate;
    newProductCard.dimensions=          req.body.dimensions;
    newProductCard.bOvenHeat=           req.body.bOvenHeat;
    newProductCard.pOvenHeat=           req.body.pOvenHeat;
    newProductCard.bOvenPeriod=         req.body.bOvenPeriod;
    newProductCard.pOvenPeriod=         req.body.pOvenPeriod;
    newProductCard.engobFactors=        req.body.engobFactors;
    newProductCard.paintFactors=        req.body.paintFactors;
    newProductCard.pistonPressure=      req.body.pistonPressure;
    newProductCard.thickness=           req.body.thickness;
    newProductCard.breakingForce=       req.body.breakingForce;
    newProductCard.radiation=          req.body.radiation;

    newProductCard.paintMix=            req.body.paintMix;
    newProductCard.engobMix=            req.body.engobMix;
    newProductCard.bodyMix=             req.body.bodyMix;

    newProductCard.updatedAt=           Date.now();

    // if product card has an image
    if (req.file) {
        const index = req.file.destination.indexOf(STORAGE) + STORAGE.length;
        const imagePath = `${req.file.destination.substring(index)}/${req.file.filename}`;
        newProductCard.imageUrl = imagePath;
    }

    // validate product card
    // const {error} = validateProductCard(newProductCard);
    // if(error) return res.status(400).send(error.details[0].message);

    newProductCard = await newProductCard.save();

    let result = await ProductCard
        .populate(newProductCard, {
            path: 'paintMix',
            model: 'PaintMix'
        });

    result = await ProductCard.populate(result, {
        path: 'engobMix',
        model: 'EngobMix'
    });

    result = await ProductCard.populate(result, {
        path: 'bodyMix',
        model: 'BodyMix'
    });


    return res.send(result);
}

async function deleteProductCard(req, res) {
    const productCard = await ProductCard.findByIdAndRemove(req.params.id);
    if(!productCard) return res.status(404).send('Product Card not found!!');

    return res.send(productCard);
}

async function attachImage(req, res, err) {
    let imagePath;
    console.log('body ', req.body);

    // find product card
    let productCard = await ProductCard.findById(req.params.id);

    // image validation
    if (err instanceof multer.MulterError) {
      return res.status(400).send(req.fileValidationError);
    }
    if(req.fileValidationError) {
      return res.status(400).send(req.fileValidationError);
    }
  

    if (req.file) {
      const index = req.file.destination.indexOf(STORAGE) + STORAGE.length;
      imagePath = `${req.file.destination.substring(index)}/${req.file.filename}`;
    }

    productCard.imageUrl = imagePath;

    productCard = await productCard.save();

    let result = await ProductCard
        .populate(productCard, {
            path: 'paintMix',
            model: 'PaintMix'
        });

    result = await ProductCard.populate(result, {
        path: 'engobMix',
        model: 'EngobMix'
    });

    result = await ProductCard.populate(result, {
        path: 'bodyMix',
        model: 'BodyMix'
    });

    return res.send(productCard);
}


function validateProductCard(productCard) {
    const dimensionsSchema = Joi.object().keys({
       width:           Joi.number().min(1).optional(),
       height:           Joi.number().min(1).optional(),
    });

    const factorSchema = Joi.object().keys({
        weight: Joi.number(),
        density: Joi.number(),
        viscosity: Joi.number(),
    });

    const heatSchema = Joi.object().keys({
        low: Joi.number(),
        high: Joi.number(),
    });

    const schema = {
        _id:            Joi.optional(),
        createdAt:      Joi.string().optional(),
        productName:    Joi.string().trim().min(1).required(),
        code:           Joi.string().trim().min(1).required(),
        type:           Joi.string().trim().min(1).required(),
        glize:          Joi.string().trim().min(1).required(),
        imageUrl:       Joi.string().trim(),
        productionDate: Joi.date().optional(),
        bOvenHeat:      heatSchema,
        pOvenHeat:      heatSchema,
        bOvenPeriod:    Joi.number().min(1).optional(),
        pOvenPeriod:    Joi.number().min(1).optional(),
        engobFactors:   factorSchema,
        paintFactors:   factorSchema,
        pistonPressure: Joi.number().min(1).optional(),
        thickness:      Joi.number().min(1).optional(),
        breakingForce:  Joi.number().min(1).optional(),
        radiation:     Joi.number().min(1).optional(),
        createdAt:      Joi.date().default(Date.now()),
        dimensions:     dimensionsSchema,
        paintMix:       Joi.string().required(),
        engobMix:       Joi.string().required(),
        bodyMix:        Joi.string().required()
    };

    return Joi.validate(productCard, schema);
}

module.exports = {getProductCards, createProductCard, updateProductCard, deleteProductCard, attachImage};