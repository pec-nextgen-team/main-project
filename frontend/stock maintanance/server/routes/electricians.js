import { Router } from 'express'
import {
  listElectricians,
  getElectrician,
  createElectrician,
} from '../controllers/electricianController.js'

const router = Router()

// GET  /api/electricians
router.get('/', listElectricians)

// GET  /api/electricians/:id
router.get('/:id', getElectrician)

// POST /api/electricians
router.post('/', createElectrician)

export default router
