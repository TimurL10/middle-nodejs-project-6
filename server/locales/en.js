// @ts-check

export default {
  translation: {
    appName: 'Fastify Boilerplate',
    flash: {
      session: {
        create: {
          success: 'You are logged in',
          error: 'Wrong email or password',
        },
        delete: {
          success: 'You are logged out',
        },
      },
      users: {
        create: {
          error: 'Failed to register',
          success: 'User registered successfully',
        },
        update: {
          error: 'Failed to update user',
          success: 'User updated successfully',
        },
        delete: {
          error: 'Failed to delete user',
          success: 'User deleted successfully',
      },
      authError: 'Access denied! Please login',
    },
    layouts: {
      application: {
        users: 'Users',
        signIn: 'Login',
        signUp: 'Register',
        signOut: 'Logout',
      },
    },
    views: {
      session: {
        new: {
          signIn: 'Login',
          submit: 'Login',
        },
      },
      users: {
        id: 'ID',
        email: 'Email',
        createdAt: 'Created at',
        firstName: 'Full name',
        new: {
          submit: 'Register',
          signUp: 'Register',
        },
        edit: {
          action: 'Edit',
          submit: 'Register',
          signUp: 'Register',
          editProfile: 'Edit profile',
          firstName: 'First name',
          lastName: 'Last name',
          password: 'Password',
        },
        delete: {
          action: 'Delete',
        }
      },
      welcome: {
        index: {
          hello: 'Hello from Hexlet!',
          description: 'Online programming school',
          more: 'Learn more',
        },
      },
    },
  },
}
}
