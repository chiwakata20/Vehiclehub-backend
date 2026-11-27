const multer = require("multer");

const imageExtensions = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 5,
  },
  fileFilter(req, file, callback) {
    if (!imageExtensions.has(file.mimetype)) {
      return callback(new Error("Only JPEG, PNG, and WebP images are allowed."));
    }

    callback(null, true);
  },
});

async function uploadVehiclePhoto(file) {
  const { put } = await import("@vercel/blob");

  return put(`vehicles/photo${imageExtensions.get(file.mimetype)}`, file.buffer, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.mimetype,
  });
}

module.exports = { upload, uploadVehiclePhoto };