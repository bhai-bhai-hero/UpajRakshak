const express=require('express');
const bodyParser=require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const companies = require('../models/companies');
const companyRouter=express.Router();
companyRouter.use(bodyParser.json());
const cors = require('./cors');
companyRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
     companies.find({})
    .populate('ownername')
    .then((companies) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(companies);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    req.body.ownername = req.user._id;
     companies.create(req.body)
     
    .then((company) => {
        
        console.log('company Created ', company);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(company);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /companies');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
  companies.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});
companyRouter.route('/:companyId')
.get(cors.cors, (req,res,next) => {
    companies.findById(req.params.companyId)
    .populate('ownername')
    .then((company) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(company);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /companies/'+ req.params.companyId);
})

.put(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
   companies.findById(req.params.companyId)
   
    .then((company)=>{
        if (company != null) {
            if (company.ownername.toString() != req.user._id.toString()) {
                err = new Error('You are not authorized to edit this company');
                err.status = 403;
                return next(err);
            }
            if (req.body. price_per_kg) {
                company.price_per_kg = req.body.price_per_kg;
            }
            company.save()
            .then((company) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(company);
            }, (err) => next(err));
        }
            
    }, (err) => next(err))
    .catch((err) => next(err));
   
   
})
.delete(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    companies.findById(req.params.companyId)
    
     .then((company)=>{
         if (company != null) {
             if (company.ownername.toString() != req.user._id.toString()) {
                 err = new Error('You are not authorized to edit this company');
                 err.status = 403;
                 return next(err);
             }
             company.remove();
             company.save()
             .then((company) => {
                 res.statusCode = 200;
                 res.setHeader('Content-Type', 'application/json');
                 res.json(company);
             }, (err) => next(err));
         }
             
     }, (err) => next(err))
     .catch((err) => next(err));
});



module.exports = companyRouter;