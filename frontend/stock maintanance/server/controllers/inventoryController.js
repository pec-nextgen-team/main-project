import { prisma } from '../prismaClient.js'

const REQUIRED_FIELDS = ['itemName', 'category', 'unit', 'location', 'openingStock', 'availableStock', 'unitPrice']

function deriveStatus(availableStock, reorderLevel = 20) {
  if (availableStock <= 0) return 'Out of Stock'
  if (availableStock <= reorderLevel) return 'Low Stock'
  return 'In Stock'
}

async function nextItemCode() {
  const last = await prisma.inventoryItem.findFirst({
    orderBy: { itemCode: 'desc' },
  })
  const lastNumber = last ? Number(last.itemCode.replace('ITM-', '')) : 0
  return `ITM-${String(lastNumber + 1).padStart(4, '0')}`
}

export async function listInventory(req, res) {
  try {
    const { category, location, status, search } = req.query

    const items = await prisma.inventoryItem.findMany({
      where: {
        ...(category && category !== 'All Categories' ? { category } : {}),
        ...(location && location !== 'All Locations' ? { location } : {}),
        ...(status && status !== 'All Stock Status' ? { status } : {}),
        ...(search
          ? {
              OR: [
                { itemName: { contains: search, mode: 'insensitive' } },
                { itemCode: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json(items)
  } catch (err) {
    console.error('Failed to list inventory', err)
    res.status(500).json({ message: 'Failed to fetch inventory.' })
  }
}

export async function getInventoryItem(req, res) {
  try {
    const item = await prisma.inventoryItem.findUnique({
      where: { id: req.params.id },
      include: { movements: { orderBy: { createdAt: 'desc' }, take: 20 } },
    })
    if (!item) return res.status(404).json({ message: 'Item not found.' })
    res.json(item)
  } catch (err) {
    console.error('Failed to fetch item', err)
    res.status(500).json({ message: 'Failed to fetch item.' })
  }
}

export async function createInventoryItem(req, res) {
  const missing = REQUIRED_FIELDS.filter((f) => req.body[f] === undefined || req.body[f] === '')
  if (missing.length > 0) {
    return res.status(400).json({ message: 'Missing required fields.', fields: missing })
  }

  try {
    const itemCode = await nextItemCode()
    const { itemName, category, subCategory, unit, location, openingStock, availableStock, unitPrice, reorderLevel } =
      req.body

    const item = await prisma.inventoryItem.create({
      data: {
        itemCode,
        itemName,
        category,
        subCategory: subCategory || null,
        unit,
        location,
        openingStock: Number(openingStock),
        availableStock: Number(availableStock),
        unitPrice: Number(unitPrice),
        reorderLevel: reorderLevel ? Number(reorderLevel) : 20,
        status: deriveStatus(Number(availableStock), reorderLevel ? Number(reorderLevel) : 20),
      },
    })

    res.status(201).json(item)
  } catch (err) {
    console.error('Failed to create item', err)
    res.status(500).json({ message: 'Failed to create item.' })
  }
}

export async function updateInventoryItem(req, res) {
  try {
    const existing = await prisma.inventoryItem.findUnique({ where: { id: req.params.id } })
    if (!existing) return res.status(404).json({ message: 'Item not found.' })

    const { itemName, category, subCategory, unit, location, openingStock, availableStock, unitPrice, reorderLevel } =
      req.body

    const nextAvailable = availableStock !== undefined ? Number(availableStock) : existing.availableStock
    const nextReorder = reorderLevel !== undefined ? Number(reorderLevel) : existing.reorderLevel

    const item = await prisma.inventoryItem.update({
      where: { id: req.params.id },
      data: {
        ...(itemName !== undefined ? { itemName } : {}),
        ...(category !== undefined ? { category } : {}),
        ...(subCategory !== undefined ? { subCategory } : {}),
        ...(unit !== undefined ? { unit } : {}),
        ...(location !== undefined ? { location } : {}),
        ...(openingStock !== undefined ? { openingStock: Number(openingStock) } : {}),
        availableStock: nextAvailable,
        ...(unitPrice !== undefined ? { unitPrice: Number(unitPrice) } : {}),
        reorderLevel: nextReorder,
        status: deriveStatus(nextAvailable, nextReorder),
      },
    })

    res.json(item)
  } catch (err) {
    console.error('Failed to update item', err)
    res.status(500).json({ message: 'Failed to update item.' })
  }
}

export async function deleteInventoryItem(req, res) {
  try {
    await prisma.inventoryItem.delete({ where: { id: req.params.id } })
    res.status(204).send()
  } catch (err) {
    console.error('Failed to delete item', err)
    res.status(500).json({ message: 'Failed to delete item.' })
  }
}

async function recordMovement(req, res, type, applyDelta) {
  const { quantity, note } = req.body
  const qty = Number(quantity)

  if (!qty || qty <= 0) {
    return res.status(400).json({ message: 'quantity must be greater than 0.' })
  }

  try {
    const item = await prisma.inventoryItem.findUnique({ where: { id: req.params.id } })
    if (!item) return res.status(404).json({ message: 'Item not found.' })

    const nextAvailable = applyDelta(item.availableStock, qty)

    const [updatedItem] = await prisma.$transaction([
      prisma.inventoryItem.update({
        where: { id: item.id },
        data: {
          availableStock: nextAvailable,
          status: deriveStatus(nextAvailable, item.reorderLevel),
        },
      }),
      prisma.stockMovement.create({
        data: { itemId: item.id, type, quantity: qty, note: note || null },
      }),
    ])

    res.json(updatedItem)
  } catch (err) {
    console.error(`Failed to record ${type} movement`, err)
    res.status(500).json({ message: 'Failed to record stock movement.' })
  }
}

export const stockIn = (req, res) => recordMovement(req, res, 'IN', (stock, qty) => stock + qty)
export const stockOut = (req, res) => recordMovement(req, res, 'OUT', (stock, qty) => Math.max(0, stock - qty))
export const stockAdjustment = (req, res) => recordMovement(req, res, 'ADJUSTMENT', (_stock, qty) => qty)
