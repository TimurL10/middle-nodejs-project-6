// @ts-check

export default {
  translation: {
    appName: 'Менеджер задач',
    flash: {
      session: {
        create: {
          success: 'Вы залогинены',
          error: 'Неправильный емейл или пароль',
        },
        delete: {
          success: 'Вы разлогинены',
        },
      },
      users: {
        create: {
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
        },
        update: {
          error: 'Не удалось обновить пользователя',
          success: 'Пользователь успешно обновлён',
        },
        delete: {
          error: 'Не удалось удалить пользователя',
          success: 'Пользователь успешно удалён',
          action: 'Удалить',
        }
      },
      taskStatuses: {
        create: {
          success: 'Статус успешно создан',
        },
        update: {
          success: 'Статус успешно изменен',
        },
        delete: {
          error: 'Не удалось удалить статус',
          success: 'Статус успешно удален',
        },
      },
      tasks: {
        create: {
          error: 'Не удалось создать задачу',
          success: 'Задача успешно создана',
        },
      },
      labels: {
        create: {
          error: 'Не удалось создать метку',
          success: 'Метка успешно создана',
        },
        update: {
          error: 'Не удалось изменить метку',
          success: 'Метка успешно изменена',
        },
        delete: {
          error: 'Не удалось удалить метку',
          success: 'Метка успешно удалена',
        },
      },
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
    },
    layouts: {
      application: {
        users: 'Пользователи',
        taskStatuses: 'Статусы',
        tasks: 'Задачи',
        labels: 'Метки',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
      },
    },
    views: {
      session: {
        new: {
          signIn: 'Вход',
          submit: 'Войти',
        },
      },
      users: {
        id: 'ID',
        email: 'Email',
        createdAt: 'Дата создания',
        firstName: 'Имя',
        lastName: 'Фамилия',
        password: 'Пароль',
        new: {
          submit: 'Сохранить',
          signUp: 'Регистрация',
        },
        edit: {
          action: 'Редактировать',
          submit: 'Сохранить',
          signUp: 'Регистрация',
          editProfile: 'Редактировать профиль',
          firstName: 'Имя',
          lastName: 'Фамилия',
          password: 'Пароль',
        },
        delete: {
          error: 'Не удалось удалить пользователя',
          success: 'Пользователь успешно удалён',
          action: 'Удалить',
        }
      },
      taskStatuses: {
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        index: {
          header: 'Статусы',
          create: 'Создать статус',
        },
        new: {
          header: 'Создать статус',
          submit: 'Создать',
        },
        edit: {
          header: 'Изменить статус',
          action: 'Изменить',
          submit: 'Изменить',
        },
        delete: {
          action: 'Удалить',
        },
      },
      tasks: {
        id: 'ID',
        name: 'Наименование',
        description: 'Описание',
        status: 'Статус',
        creator: 'Автор',
        executor: 'Исполнитель',
        label: 'Метка',
        labels: 'Метки',
        onlyMyTasks: 'Только мои задачи',
        selectStatus: 'Выберите статус',
        selectExecutor: 'Без исполнителя',
        createdAt: 'Дата создания',
        index: {
          header: 'Задачи',
          create: 'Создать задачу',
          filter: 'Показать',
        },
        new: {
          header: 'Создать задачу',
          submit: 'Создать',
        },
        edit: {
          header: 'Изменить задачу',
          action: 'Изменить',
          submit: 'Изменить',
        },
        delete: {
          action: 'Удалить',
        },
      },
      labels: {
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        index: {
          header: 'Метки',
          create: 'Создать метку',
        },
        new: {
          header: 'Создать метку',
          submit: 'Создать',
        },
        edit: {
          header: 'Изменить метку',
          action: 'Изменить',
          submit: 'Изменить',
        },
        delete: {
          action: 'Удалить',
        },
      },
      welcome: {
        index: {
          hello: 'Привет от Хекслета!',
          description: 'Практические курсы по программированию',
          more: 'Узнать Больше',
        },
      },
    },
  },
};
