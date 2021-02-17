const HttpError = require("../utils/HttpError");
const Seed = require("../models/Seed");
const { validationResult } = require("express-validator");

const filterSeeds = async (req, res, next) => {
  try {
    if (!req.body) {
      return next(new httpError("No search query given", 400));
    }

    const seeds = await Seed.fuzzySearch(req.body.query)
      .select("-name_fuzzy -scientificName_fuzzy")
      .then((seeds) => {
        return seeds.filter((seed) => seed._doc.confidenceScore >= 6);
      });
    res.json({ seeds });
  } catch (error) {
    return next(error);
  }
};

const getCartItems = async (req, res, next) => {
  try {
    console.log("body", req.body);
    if (!req.body) {
      return next(new httpError("No cart items given to find", 404));
    }

    const ids = Object.keys(req.body);

    const seeds = await Seed.find({ _id: ids }).select(
      "-name_fuzzy -scientificName_fuzzy"
    );

    res.json({ seeds });
  } catch (error) {
    return next(error);
  }
};

const createSeed = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let seed = await Seed.findOne({ name: req.body.name });

    if (seed) {
      return next(new HttpError("Seed name must be unique", 404));
    }

    seed = new Seed({
      name: req.body.name,
      scientificName: req.body.scientificName,
      description: req.body.description,
      price: req.body.price,
      size: req.body.size,
      imageUrl: req.body.imageUrl,
      user: req.user.id,
    });

    await seed.save();

    return res.json({ seed });
  } catch (error) {
    next(error);
  }
};

const getSeeds = async (req, res, next) => {
  try {
    const seeds = await Seed.find().select("-name_fuzzy -scientificName_fuzzy");

    if (!seeds) {
      return next(new HttpError("No seeds found in database", 404));
    }

    return res.json({ seeds });
  } catch (error) {
    next(error);
  }
};

module.exports = { createSeed, getSeeds, getCartItems, filterSeeds };
