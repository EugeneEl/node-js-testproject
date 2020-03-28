const Joi = require('joi');

module.exports = (RouteStore, ValidationStore) => (req, res, next) => {
  const routePath = req.route.path.replace('/api', '');
  const modelName = routePath.split('/')[1];
  const routes = Object.values(RouteStore.routes[modelName]);

  let schema = {};
  for (const key in ValidationStore.schemas) {
    if (ValidationStore.schemas.hasOwnProperty(key)) {
      if (key === modelName) schema = { ...ValidationStore.schemas[key] };
    }
  }

  const routeMethod = req.method.toLowerCase();
  let allRouteValues = {};

  // get currenc route config
  const currentRouteConfig = routes.find(
      (_route) => _route.path === routePath &&
        _route.method === routeMethod
  );

  if (!currentRouteConfig.validation) next();

  const _validation = currentRouteConfig.validation || {};
  const _validationSources = _validation.sources || [];
  const _validationRequired = _validation.required || [];
  const _validationOptional = _validation.optional || [];

  // get all route fields
  _validationSources.forEach(src => {
    allRouteValues = { ...allRouteValues, ...req[src] };
  });

  // clear unnesessary keys from validation schema
  const allValidationKeys = [..._validationRequired, ..._validationOptional];

  Object.keys(schema).forEach(_key => {
    const checkedKey = allValidationKeys.find(key => key === _key);

    if (!checkedKey) delete schema[_key];
  });

  // add required to keys
  _validationRequired.forEach(_key => {
    const value = schema[_key] || {};
    if (!value.required) {
      console.log(`Error in Joi key ${_key}`);
    }

    console.log(_key);

    if (schema[_key]) {
      schema[_key] = schema[_key].required();
    }
  });

  // validation
  const { error } = Joi.object()
      .keys(schema)
      .validate(allRouteValues);

  if (error) {
    res.status(400).send(error.details[0]);

    return;
  }

  next();
};
