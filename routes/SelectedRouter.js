const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Selecteds = require('../models/Selecteds');

const SelectedRouter = express.Router();

SelectedRouter.use(bodyParser.json());

SelectedRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Selecteds.find({})
        .populate('companies')
        .then((Selecteds) => {
            // extract Selecteds that match the req.user.id
            if (Selecteds) {
                user_Selecteds = Selecteds.filter(select => select.user._id.toString() === req.user.id.toString())[0];
                if(!user_Selecteds) {
                    var err = new Error('You have no Selecteds!');
                    err.status = 404;
                    return next(err);
                }
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(user_Selecteds);
            } else {
                var err = new Error('There are no Selecteds');
                err.status = 404;
                return next(err);
            }
            
        }, (err) => next(err))
        .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, 
    (req, res, next) => {
        Selecteds.find({})
            .populate('user')
            .populate('companies')
            .then((Selected) => {
                var user;
                if(Selected)
                    user = Selected.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
                if(!user) 
                    user = new Selecteds({user: req.user.id});
                for(let i of req.body){
                    if(user.companies.find((d_id) => {
                        if(d_id._id){
                            return d_id._id.toString() === i._id.toString();
                        }
                    }))
                        continue;
                    user.companies.push(i._id);
                }
                user.save()
                    .then((userFavs) => {
                        res.statusCode = 201;
                        res.setHeader("Content-Type", "application/json");
                        res.json(userFavs);
                        console.log("Selecteds Created");
                    }, (err) => next(err))
                    .catch((err) => next(err));
                
            })
            .catch((err) => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /Selecteds');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Selecteds.find({})
        .populate('user')
        .populate('companies')
        .then((Selecteds) => {
            var favToRemove;
            if (Selecteds) {
                favToRemove = Selecteds.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
            } 
            if(favToRemove){
                favToRemove.remove()
                    .then((result) => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(result);
                    }, (err) => next(err));
                
            } else {
                var err = new Error('You do not have any Selecteds');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
});

SelectedRouter.route('/:companyId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Selecteds.find({})
        .populate('user')
        .populate('companies')
        .then((Selecteds) => {
            if (Selecteds) {
                const favs = Selecteds.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
                const company = favs.companies.filter(company => company.id === req.params.companyId)[0];
                if(company) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(company);
                } else {
                    var err = new Error('You do not have company ' + req.params.companyId);
                    err.status = 404;
                    return next(err);
                }
            } else {
                var err = new Error('You do not have any Selecteds');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, 
    (req, res, next) => {
        Selecteds.find({})
            .populate('user')
            .populate('companies')
            .then((Selecteds) => {
                var user;
                if(Selecteds)
                    user = Selecteds.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
                if(!user) 
                    user = new Selecteds({user: req.user.id});
                if(!user.companies.find((d_id) => {
                    if(d_id._id)
                        return d_id._id.toString() === req.params.companyId.toString();
                }))
                    user.companies.push(req.params.companyId);
                
                user.save()
                    .then((userFavs) => {
                        res.statusCode = 201;
                        res.setHeader("Content-Type", "application/json");
                        res.json(userFavs);
                        console.log("Selecteds Created");
                    }, (err) => next(err))
                    .catch((err) => next(err));

            })
            .catch((err) => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /Selecteds/:companyId');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Selecteds.find({})
        .populate('user')
        .populate('companies')
        .then((Selecteds) => {
            var user;
            if(Selecteds)
                user = Selecteds.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
            if(user){
                user.companies = user.companies.filter((companyid) => companyid._id.toString() !== req.params.companyId);
                user.save()
                    .then((result) => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(result);
                    }, (err) => next(err));
                
            } else {
                var err = new Error('You do not have any Selecteds');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
});

module.exports = SelectedRouter;