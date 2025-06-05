const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const { protect, authorize } = require('../middleware/auth');


router.get('/', async (req, res) => {
    try {
        const cars = await Car.find();
        res.status(200).json({
            success: true,
            count: cars.length,
            data: cars
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({
                success: false,
                error: 'Car not found'
            });
        }
        res.status(200).json({
            success: true,
            data: car
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const car = await Car.create(req.body);
        res.status(201).json({
            success: true,
            data: car
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
});

router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!car) {
            return res.status(404).json({
                success: false,
                error: 'Car not found'
            });
        }
        res.status(200).json({
            success: true,
            data: car
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
});


router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const car = await Car.findByIdAndDelete(req.params.id);
        if (!car) {
            return res.status(404).json({
                success: false,
                error: 'Car not found'
            });
        }
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
});

module.exports = router; 