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
          action: 'Delete',
        },
      },
      taskStatuses: {
        create: {
          success: 'Status created successfully',
        },
        update: {
          success: 'Status updated successfully',
        },
        delete: {
          error: 'Failed to delete status',
          success: 'Status deleted successfully',
        },
      },
      tasks: {
        create: {
          error: 'Failed to create task',
          success: 'Task created successfully',
        },
      },
      labels: {
        create: {
          error: 'Failed to create label',
          success: 'Label created successfully',
        },
        update: {
          error: 'Failed to update label',
          success: 'Label updated successfully',
        },
        delete: {
          error: 'Failed to delete label',
          success: 'Label deleted successfully',
        },
      },
      authError: 'Access denied! Please login',
    },
    layouts: {
      application: {
        users: 'Users',
        taskStatuses: 'Statuses',
        tasks: 'Tasks',
        labels: 'Labels',
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
        lastName: 'Last name',
        password: 'Password',
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
        },
      },
      taskStatuses: {
        id: 'ID',
        name: 'Name',
        createdAt: 'Created at',
        index: {
          header: 'Statuses',
          create: 'Create status',
        },
        new: {
          header: 'Create status',
          submit: 'Create',
        },
        edit: {
          header: 'Edit status',
          action: 'Edit',
          submit: 'Edit',
        },
        delete: {
          action: 'Delete',
        },
      },
      tasks: {
        id: 'ID',
        name: 'Name',
        description: 'Description',
        status: 'Status',
        creator: 'Author',
        executor: 'Executor',
        label: 'Label',
        labels: 'Labels',
        onlyMyTasks: 'Only my tasks',
        selectStatus: 'Select status',
        selectExecutor: 'No executor',
        createdAt: 'Created at',
        index: {
          header: 'Tasks',
          create: 'Create task',
          filter: 'Show',
        },
        new: {
          header: 'Create task',
          submit: 'Create',
        },
        edit: {
          header: 'Edit task',
          action: 'Edit',
          submit: 'Edit',
        },
        delete: {
          action: 'Delete',
        },
      },
      labels: {
        id: 'ID',
        name: 'Name',
        createdAt: 'Created at',
        index: {
          header: 'Labels',
          create: 'Create label',
        },
        new: {
          header: 'Create label',
          submit: 'Create',
        },
        edit: {
          header: 'Edit label',
          action: 'Edit',
          submit: 'Edit',
        },
        delete: {
          action: 'Delete',
        },
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
};
