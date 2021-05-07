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
    if (item.min <= item.max) {
      if (item.min && !item.max) where[filter_name] = { [Op.gt]: item.min };
      else if (!item.min && item.max) where[filter_name] = { [Op.lt]: item.max };
      else where[filter_name] = { [Op.between]: [item.min, item.max] };
      return true
    } else if (item.min > item.max) {
      return false;
    }
  },
  va: (taux, npm, vpm) => {
    const t_mensuel=(taux/12)/100;
    const tauxAct = Math.pow(1 + t_mensuel, -npm);
 
    if((1 - tauxAct) === 0) return 0;

    const va = vpm * (1 - tauxAct) / t_mensuel;
  
    return Math.round(va);
  },
  vpm: (npm, taux, p) => {
    const t_mensuel=(taux/12)/100;
 
    const R=(1-Math.pow((1+t_mensuel),- npm))/t_mensuel;
     
    const VPM=((p)/R);
     
    return Math.round(VPM * 100) / 100;
  },
  pmt: (revenus, charges) => {  
    const mensualite = (revenus / 3) - charges;
    return Math.round(mensualite * 100) / 100;
  },
};
