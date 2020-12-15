const express=require('express');
const bodyParser=require('body-parser');
const mongoose = require('mongoose');
const leaders = require('../models/leaders');
const leaderRouter=express.Router();
leaderRouter.use(bodyParser.json());
const cors = require('./cors');
leaderRouter.route('/')
.get(cors.cors, (req,res,next) => {
     leaders.find({})
    .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,(req, res, next) => {
    leaders.create(req.body)
    .then((leader) => {
        console.log('leader Created ', leader);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leader');
})
.delete(cors.corsWithOptions,(req, res, next) => {
  leaders.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});
leaderRouter.route('/:leaderId')
.get(cors.cors, (req,res,next) => {
  leaders.findById(req.params.leaderId)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(cors.corsWithOptions,(req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /leader/'+ req.params.leaderd);
})

.put(cors.corsWithOptions,(req, res, next) => {
  leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, { new: true })
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions,(req, res, next) => {
   leaders.findByIdAndRemove(req.params.leaderId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = leaderRouter;