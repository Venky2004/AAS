const Crop = require('../models/Crop');
const { getDistance } = require('geolib');

exports.postCrop = async (req, res) => {
  try {
    const photos = req.files.map((file) => file.path);
    const crop = new Crop({ ...req.body, photos });
    await crop.save();
    res.status(201).send(crop);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getCrops = async (req, res) => {
  try {
    const { lat, lon, sortBy = 'datetime_created' } = req.query;
    const crops = await Crop.find().populate('posted_by');
    const filteredCrops = lat && lon
      ? crops.filter(crop => getDistance(
          { latitude: crop.posted_by.location.lat, longitude: crop.posted_by.location.lon },
          { latitude: parseFloat(lat), longitude: parseFloat(lon) }
        ) <= 100000)
      : crops;
    const sortedCrops = filteredCrops.sort((a, b) => b[sortBy] - a[sortBy]);
    res.status(200).send(sortedCrops);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.updateCrop = async (req, res) => {
  try {
    const crop = await Crop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(crop);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteCrop = async (req, res) => {
  try {
    await Crop.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: 'Crop deleted successfully' });
  } catch (error) {
    res.status(400).send(error);
  }
};
