const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

module.exports = async (req, res, next) => {
  if (!req.file) return next();
  try {
    const name = `${path.parse(req.file.filename).name}-cover.webp`;
    await sharp(req.file.path)
      .resize(600, 900, { fit: 'cover', position: 'top' })
      .webp({ quality: 80 })
      .toFile(path.join(req.file.destination, name));
    fs.unlinkSync(req.file.path);
    req.file.filename = name;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Could not process the image' });
  }
};