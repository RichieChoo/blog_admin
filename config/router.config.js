export default [
    // user
    {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
            { path: '/user', redirect: '/user/login' },
            { path: '/user/login', component: './User/Login' },
            { path: '/user/register', component: './User/Register' },
            { path: '/user/register-result', component: './User/RegisterResult' },
        ],
    },
    // app
    {
        path: '/',
        component: '../layouts/BasicLayout',
        Routes: ['src/pages/Authorized'],
        authority: ['admin', 'user'],
        routes: [
            { path: '/', redirect: '/manage/article' },
            {
                path: '/manage',
                name: 'manage',
                icon: 'desktop',
                routes: [
                    {
                        path: '/manage/article',
                        icon: 'file-text',
                        name: 'article',
                        component: './Manage/Article',
                    },
                    {
                        path: '/manage/article/form',
                        name: 'articleForm',
                        hideInMenu: true,
                        component: './Manage/ArticleForm',
                    }
                ],
            },
            {
                name: 'account',
                icon: 'user',
                path: '/account',
                routes: [
                    {
                        path: '/account/center',
                        name: 'center',
                        component: './Account/Center/Center',
                        routes: [
                            {
                                path: '/account/center',
                                redirect: '/account/center/articles',
                            },
                            {
                                path: '/account/center/articles',
                                component: './Account/Center/Articles',
                            },
                            {
                                path: '/account/center/applications',
                                component: './Account/Center/Applications',
                            },
                            {
                                path: '/account/center/projects',
                                component: './Account/Center/Projects',
                            },
                        ],
                    },
                ],
            },
            {
                name: 'exception',
                icon: 'warning',
                path: '/exception',
                hideInMenu: true,
                routes: [
                    // exception
                    {
                        path: '/exception/403',
                        name: 'not-permission',
                        hideInMenu: true,
                        component: './Exception/403',
                    },
                    {
                        path: '/exception/404',
                        name: 'not-find',
                        hideInMenu: true,
                        component: './Exception/404',
                    },
                    {
                        path: '/exception/500',
                        name: 'server-error',
                        hideInMenu: true,
                        component: './Exception/500',
                    },
                    {
                        path: '/exception/trigger',
                        name: 'trigger',
                        hideInMenu: true,
                        component: './Exception/TriggerException',
                    },
                ],
            },
        ],
    },
];
