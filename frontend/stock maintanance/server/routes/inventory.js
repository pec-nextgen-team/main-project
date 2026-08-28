import { Router } from 'express'
import {
  listInventory,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  stockIn,
  stockOut,
  stockAdjustment,
} from '../controllers/inventoryController.js'

const router = Router()

// GET    /api/inventory
router.get('/', listInventory)

// GET    /api/inventory/:id
router.get('/:id', getInventoryItem)

// POST   /api/inventory
router.post('/', createInventoryItem)

// PUT    /api/inventory/:id
router.put('/:id', updateInventoryItem)

// DELETE /api/inventory/:id
router.delete('/:id', deleteInventoryItem)

// POST   /api/inventory/:id/stock-in
router.post('/:id/stock-in', stockIn)

// POST   /api/inventory/:id/stock-out
router.post('/:id/stock-out', stockOut)

// POST   /api/inventory/:id/adjustment
router.post('/:id/adjustment', stockAdjustment)

export default router
