import { Router } from 'express';
import { ReviewController } from '../controllers/ReviewController';
import { authenticate } from '../middleware/auth';

const router = Router();
import multer from 'multer';
import path from 'path';

// configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', 'uploads', 'reviews'));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + unique + ext);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// all routes require authentication
router.use(authenticate);

router.post('/', ReviewController.create);
router.get('/public', ReviewController.getPublic);
router.get('/:bookingId', ReviewController.getByBooking);

// allow image uploads for a given review id (owner or admin)
router.post('/:id/images', upload.array('images', 5), ReviewController.uploadImages);

// admin only
router.get('/admin/all', ReviewController.listAll);
router.put('/admin/:id/approve', ReviewController.approve);
router.delete('/admin/:id', ReviewController.delete);

export default router;
