module.exports = {
  definition: `
    type UserEventCustom {
      id: ID!
      created_at: DateTime!
      updated_at: DateTime!
      event: ID!
      users_permissions_user: ID!
    }

    type UsersPermissionsMeCustom {
      id: ID!
      email: String!
      events: [Event!]
      user_events: [UserEventCustom!]
      confirmed: Boolean
      blocked: Boolean
    }
  `,
  query: `
    meCustom: UsersPermissionsMeCustom
  `,
  type: {},
  resolver: {
    Query: {
      meCustom: {
        description: 'Return logged in user details',
        resolver: 'plugins::users-permissions.user.me',
      }
    },
  },
};