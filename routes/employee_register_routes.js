import express from 'express';
import { registerEmployee, getNewUsers, getAllEmployees, getEmployeeById, updateEmployee, addCertification, deleteCertification } from '../controllers/employee_register_controller.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

router.post('/register', registerEmployee);
router.get('/new', getNewUsers);
router.get('/all', getAllEmployees);
router.get('/:user_id', getEmployeeById);
router.put('/:user_id', upload.fields([{ name: 'certification_front[]' }, { name: 'certification_back[]' }]), updateEmployee);
router.post('/:user_id/certifications', upload.fields([{ name: 'front' }, { name: 'back' }]), addCertification);
router.delete('/:user_id/certifications/:certification_id', deleteCertification);

export default router;