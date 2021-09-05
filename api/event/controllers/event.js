'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
  /**
* Create a record.
*
* @return {Object}
*/

  async create(ctx) {
    let entity;
    const user = ctx.state.user;

    if (!user) {
      return ctx.badRequest(null, [{ messages: [{ id: 'No authorization header was found' }] }]);
    }

    ctx.request.body.users_permissions_user = user.id;
    entity = await strapi.services.event.create(ctx.request.body);
    return sanitizeEntity(entity, { model: strapi.models.event });
  },
};
