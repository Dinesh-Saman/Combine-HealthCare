// routes/inventoryRoutes.js
const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.post('/', inventoryController.createInventoryItem);
router.get('/', inventoryController.getAllInventoryItems);
router.get('/:id', inventoryController.getInventoryItemById);
router.put('/:id', inventoryController.updateInventoryItem);
router.delete('/:id', inventoryController.deleteInventoryItem);
router.get('/report', inventoryController.generateStockReport);
router.get('/check-stock', inventoryController.checkStockAndNotify);

module.exports = router;
