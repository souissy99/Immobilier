const { Op, ValidationError, UniqueConstraintError } = require('sequelize');

const { Immobilier } = require('../../models');
const auth = require('../../auth/auth');
const Tools = require('../tools.js');

module.exports = (router) => {
  /** COLLECTIONS OPPERATION */
  router.route('/immobiliers')
    .get(async (req, res) => {
      // #swagger.tags = ['Immobiliers']
      try {
        const params = req.query;
        const where = {};

        if (params.id_site_source) where.id_site_source = params.id_site_source;
        if(params.category && params.category !== 'all') where.category = params.category;
        if (params.code_postal) where.code_postal = { [Op.eq]: params.code_postal };
        if (params.rooms) {
          const err = Tools.rangeFilter(where, 'rooms', params.rooms)
          if (!err) return res.status(400).json('Le nombre de pièces minimun ne peut pas être suppérieur au nombre de pièces maximum.');
        }
        if (params.bedrooms) {
          const err = Tools.rangeFilter(where, 'bedrooms', params.bedrooms)
          if (!err) return res.status(400).json('Le nombre de chambres minimun ne peut pas être suppérieur au nombre de chambres maximum.');
        }
        if (params.price) {
          const err = Tools.rangeFilter(where, 'price', params.price)
          if (!err) return res.status(400).json('Le prix minimun ne peut pas être suppérieur au prix maximum.');
        }
        if (params.surface) {
          const err = Tools.rangeFilter(where, 'surface', params.surface)
          if (!err) return res.status(400).json('La surface minimun ne peut pas être suppérieur à la surface maximum.');
        }

        const options = {
          where,
          ...Tools.pagination(params)
        };

        const immobiliers = await Immobilier.findAll(options);
        // immobiliers.forEach(p => console.log(p.toJSON()));
        res.json({ message: 'La liste des \'immobiliers\' a bien été récupérée.', data: immobiliers });
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Une erreur est survenue. Veuillez réessayer plus tard.', data: err });
      }
    })
    .all(auth)
    .post(async (req, res) => {
      // #swagger.tags = ['Immobiliers']
      try {
        const immobilier = await Immobilier.create(req.body);
        res.status(201).json({ message: `Le \'immobiliers\' ${req.body.name} a bien été crée.`, data: immobilier });
      } catch (err) {
        if (err instanceof ValidationError || err instanceof UniqueConstraintError)
          return res.status(400).json({ message: err.message, data: err });
        res.status(500).json({ message: 'Une erreur est survenue. Veuillez réessayer plus tard.', data: err });
      }
    });

  /** ITEMS OPPERATION */
  router.route('/immobilier/:id')
    .get(async (req, res) => {
      // #swagger.tags = ['Immobiliers']
      try {
        const immobilier = await Immobilier.findByPk(req.params.id);
        if (immobilier == null)
          return res.status(404).json({ message: 'Le \'immobilier\' demandé n\'existe pas.' });

        res.json({ message: `Le \'immobilier\' "${immobilier.name}" a bien été récupérée.`, data: immobilier });
      } catch (err) {
        res.status(500).json({ message: 'Une erreur est survenue. Veuillez réessayer plus tard.', data: err });
      }
    })
    .all(auth)
    .put(async (req, res) => {
      // #swagger.tags = ['Immobiliers']
      try {
        const id = req.params.id;
        const welcomToUpdate = await Immobilier.update(req.body, { where: { id: id } });
        if (welcomToUpdate == null)
          return res.status(404).json({ message: 'Le \'immobilier\' demandé n\'existe pas.' });

        const immobilier = await Immobilier.findByPk(id);
        res.json({ message: `Le \'immobilier\' "${immobilier.name}" a bien été modifié.`, data: immobilier });
      } catch (err) {
        if (err instanceof ValidationError || err instanceof UniqueConstraintError)
          return res.status(400).json({ message: err.message, data: err });
        res.status(500).json({ message: 'Une erreur est survenue. Veuillez réessayer plus tard.', data: err });
      }
    })

    .delete(async (req, res) => {
      // #swagger.tags = ['Immobiliers']
      try {
        const id = req.params.id;
        const welcomToDelete = await Immobilier.findByPk(id);
        if (welcomToDelete == null)
          return res.status(404).json({ message: 'Le \'immobilier\' demandé n\'existe pas.' });

        const immobilier = await Immobilier.destroy({ where: { id: welcomToDelete.id } });
        res.json({ message: 'Le \'immobilier\' demandé a bien été modifié.', data: immobilier });
      } catch (err) {
        res.status(500).json({ message: 'Une erreur est survenue. Veuillez réessayer plus tard.', data: err });
      }
    });
};
