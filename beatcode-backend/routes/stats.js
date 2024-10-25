const router = require('express').Router();
let Stats = require('../models/stats.model');

router.route('/').get((req, res) => {
  Stats.findOne()
    .then(stats => res.json(stats))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/').put((req, res) => {
  Stats.findOneAndUpdate({}, req.body, { new: true, upsert: true })
    .then(stats => res.json(stats))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
