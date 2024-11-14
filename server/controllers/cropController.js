const Crop = require('../models/Crop');
const { getDistance } = require('geolib');

exports.postCrop = async (req, res) => {
  try {
    const { description, price } = req.body;
    const photoPaths = req.files.map((file) => file.path);
    
    const newCrop = new Crop({
      description,
      price,
      photos: photoPaths,
      posted_by: req.user._id,
    });

    await newCrop.save();
    res.status(201).json({ message: 'Crop posted successfully', crop: newCrop });
  } catch (error) {
    console.error('Error posting crop:', error);
    res.status(500).json({ message: 'Failed to post crop' });
  }
};


exports.getCrops = async (req, res) => {
  try {
    const { lat, lon, sortBy = 'datetime_created' } = req.query;

    // Retrieve all crops and populate the `posted_by` field to access location data
    const crops = await Crop.find().populate('posted_by', 'location');

    // Filter crops by distance if lat and lon are provided
    const filteredCrops = lat && lon
      ? crops.filter(crop => getDistance(
          { latitude: crop.posted_by.location.lat, longitude: crop.posted_by.location.lon },
          { latitude: parseFloat(lat), longitude: parseFloat(lon) }
        ) <= 100000) // Distance in meters (100km here)
      : crops;

    // Sort crops based on sortBy query parameter
    const sortedCrops = filteredCrops.sort((a, b) => b[sortBy] - a[sortBy]);

    // Normalize photo paths to be accessible on the frontend
    const cropsWithFullImagePaths = sortedCrops.map(crop => ({
      ...crop.toObject(),
      photos: crop.photos.map(photo => `${req.protocol}://${req.get('host')}/${photo.replace(/\\/g, '/')}`)
    }));

    // Send the sorted and filtered crops
    res.status(200).send(cropsWithFullImagePaths);

  } catch (error) {
    console.error('Error fetching crops:', error);
    res.status(400).send({ message: 'Failed to fetch crops', error });
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
