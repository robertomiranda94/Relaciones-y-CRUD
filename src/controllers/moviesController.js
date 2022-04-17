const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require('moment');




//Llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', { movies })
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', { movie, moment: moment });
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order: [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', { movies });
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: { [db.Sequelize.Op.gte]: 8 }
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', { movies });
            });
    },
    //Rutas para trabajar con el CRUD
    add: function (req, res) {
        db.Genre.findAll({
            order: [
                ['name']
            ]
        })
            .then(allGenres => {
                return res.render('moviesAdd', {
                    allGenres
                })
            })
            .catch(error => console.log(error))
    },
    create: function (req, res) {

        const { title, rating, awards, release_date, length, genre_id } = req.body;

        db.Movie.create({
            title: title.trim(),
            rating,
            awards,
            release_date,
            length,
            genre_id
        }).then(() => { return res.redirect('/movies') })

    },
    edit: function (req, res) {
        let Movie = db.Movie.findByPk(req.params.id)
        let allGenres = db.Genre.findAll({
            order: [
                ['name']
            ]
        })
        Promise.all([Movie, allGenres])
            .then(([Movie, allGenres]) => {
                return res.render('moviesEdit', {
                    Movie,
                    allGenres,
                    releaseDate: moment(Movie.release_date).add(1, 'days').format('YYYY-MM-DD')
                })
            })
            .catch(error => console.log(error))
    },
    update: function (req, res) {
        const { title, rating, awards, release_date, length, genre_id } = req.body;

        db.Movie.update({
            title: title.trim(),
            rating,
            awards,
            release_date,
            length,
            genre_id
        },
            { where: { id: req.params.id } })
            .then(() => { return res.redirect('/movies') })
            .catch(error => console.log(error))

    },
    delete: function (req, res) {
        db.Movie.findByPk(req.params.id)
            .then(Movie => res.render('moviesDelete', { Movie }))
            .catch(error => console.log(error))
    },
    destroy: function (req, res) {
        db.Movie.destroy({
            where: {
                id: req.params.id
            }
        })
            .then(() => { return res.redirect('/movies') })
            .catch(error => console.log(error))
    }
}

module.exports = moviesController;