'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

const formatError = error => [
  { messages: [{ id: error.id, message: error.message, field: error.field }] },
];


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

    const { event: events, users_permissions_user: users_permissions_users } = ctx.request.body;

    let promises = []
    events.forEach(event => {
      users_permissions_users.forEach(users_permissions_user => {
        console.log(event, users_permissions_user)
        promises.push(strapi.services["user-event"].create({
          event,
          users_permissions_user
        }))
      })
    })

    await Promise.all(promises).then((invites) => {
      console.log(invites)
      return invites
    }).catch(err => {
      return ctx.badRequest(err), formatError({
        id: 'Invites.create.error',
        message: 'Unable to create invites',
        field: ['invites'],
      });
    })
    // ! Logic to check if the user belongs to the event
  },
};
