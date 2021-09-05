'use strict';

/**
 * User.js controller
 *
 * @description: A set of functions called "actions" for managing `User`.
 */

const _ = require('lodash');
const { sanitizeEntity } = require('strapi-utils');
const apiUserController = require('./user/api');

const twilioClient = require('twilio')(process.env.TWILIO_ID, process.env.TWILIO_SECRET);

const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query('user', 'users-permissions').model,
  });

const resolveController = ctx => {
  return apiUserController;
};

const resolveControllerMethod = method => ctx => {
  const controller = resolveController(ctx);
  const callbackFn = controller[method];

  if (!_.isFunction(callbackFn)) {
    return ctx.notFound();
  }

  return callbackFn(ctx);
};

module.exports = {
  create: resolveControllerMethod('create'),

  /**
 * Retrieve user records.
 * @return {Object|Array}
 */
  async sendOtp(ctx, next, { populate } = {}) {
    let body = ctx.request.body;

    await twilioClient.verify.services(process.env.TWILIO_SID)
      .verifications
      .create({ from: '+12019077392', to: `${body.phoneNumber}`, channel: 'sms' })
      .then(verification => {
        return ctx.body = {
          status: verification.status
        }
      }).catch(error => {
        return ctx.badRequest(
          null,

          formatError({
            id: 'Auth.form.error.phoneNumber',
            message: 'Invalid Phone Number.',
            field: ['phoneNumber'],
          })
        );
      });
  },

  /**
   * Retrieve authenticated user.
   * @return {Object|Array}
   */
   async me(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.badRequest(null, [{ messages: [{ id: 'No authorization header was found' }] }]);
    }

    let data = (await strapi.query('user', 'users-permissions').find({ id: user.id }))[0]; // added restaurants

    console.log(data)
    data.username = undefined;
    data.password = undefined;
    ctx.body = data;
  },


  // update: resolveControllerMethod('update'),
};
