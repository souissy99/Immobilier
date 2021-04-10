const Op = require('sequelize').Op;

module.exports = {
  pagination: (params) => {
    const limit = params.limit ? Number(params.limit) : 10;
    const offset = params.page && params.page > 0 ? Number(((params.page - 1) * limit)) : 0;
    return { limit, offset };
  },
  rangeFilter: (where, filter_name, filter) => {
    const item = {
      min: filter.min ? Number(filter.min) : 0,
      max: filter.max ? Number(filter.max) : 1000000000
    };
    if (item.min < item.max) {
      if (item.min && !item.max) where[filter_name] = { [Op.gt]: item.min };
      else if (!item.min && item.max) where[filter_name] = { [Op.lt]: item.max };
      else where[filter_name] = { [Op.between]: [item.min, item.max] };
      return true
    } else if (item.min > item.max) {
      return false;
    }
  }
};
