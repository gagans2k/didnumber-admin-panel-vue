const ifAuthenticated = (to, from, next) => {
    if (localStorage.getItem("auth")) {
        next();
        return;
    }
    next('/login');
};

const ifNotAuthenticated = (to, from, next) => {
    if (!localStorage.getItem("auth")) {
        next();
        return;
    }
    next('/dashboard');
};

const checkPreviousRoute = (to, from, next) => {
    if (from.path === '/signup') {
        next();
        return;
    }

    if (!localStorage.getItem("auth") && from.path === '/signup') {
        next();
        return;
    }
    next('/dashboard');
}

export default [{
    path: '/',
    redirect: '/dashboard'
},
{
    path: '/',
    redirect: '/login'
},
{
    path: '/login',
    name: 'Login',
    component: () =>
        import(
            `@/pages/Authentication/login.vue`
        ),
    beforeEnter: ifNotAuthenticated
},
{
    path: '/signup',
    name: 'SignUp',
    component: () =>
        import(
            `@/pages/Authentication/signup.vue`
        ),
    beforeEnter: ifNotAuthenticated
},
{
    path: '/forgotPassword',
    name: 'ForgotPassword',
    component: () =>
        import(
            `@/pages/Authentication/forgotPassword.vue`
        ),
    beforeEnter: ifNotAuthenticated
},
{
    path: '/securityQuestion',
    name: 'SecurityQuestion',
    component: () =>
        import(
            `@/pages/Authentication/securityQuestion.vue`
        ),
    beforeEnter: checkPreviousRoute
},
{
    path: '/updatePassword',
    name: 'UpdatePassword',
    component: () =>
        import(
            `@/pages/Authentication/updatePassword.vue`
        ),
    beforeEnter: ifNotAuthenticated
},
{
    path: '/verifyUser',
    name: 'verifyUser',
    component: () =>
        import(
            `@/pages/Authentication/verifyUser.vue`
        ),
    beforeEnter: ifNotAuthenticated
},
{
    path: '/dashboard',
    name: 'Dashboard',
    component: () =>
        import(
            `@/pages/Dashboard/Dashboard.vue`
        ),
    beforeEnter: ifAuthenticated
},
// sddddddddddddddddddddddddddd
{
    path: '/AccountList',
    name: 'AccountList',
    component: () =>
        import(
            `@/pages/Dashboard/AccountList.vue`
        ),
},
{
    path: '/CustomerOrdersList',
    name: 'Orders',
    component: () =>
        import(
            `@/pages/Dashboard/CustomerOrdersList.vue`
        ),
},
{
    path: '/didnumber',
    name: 'Did Numbers',
    component: () =>
        import(
            `@/pages/Dashboard/DidNumbers.vue`
        ),
},
{
    path: '/didnumberHistory',
    name: 'User List',
    component: () =>
        import(
            `@/pages/Dashboard/didnumberHistory.vue`
        ),
},
{
    path: '/didnumberDetails',
    name: 'didnumberDetails',
    component: () =>
        import(
            `@/pages/Dashboard/didnumberDetails.vue`
        ),
},
{
    path: '/Dashboard/:serialNumber',
    name: 'didnumberHistory',
    component: () =>
        import(
            `@/pages/Dashboard/userList.vue`
        ),
    beforeEnter: ifAuthenticated
}, {
    path: '/dashboardimport',
    name: 'Dashboard import',
    component: () =>
        import(
            `@/pages/Dashboard/dashboardimport.vue`
        ),
    beforeEnter: ifAuthenticated
},
{
    path: '/dashboarduser',
    name: 'Live List',
    component: () =>
        import(
            `@/pages/Dashboard/LiveCalls.vue`
        ),
},
{
    path: '/CustomerDIDDetails',
    name: 'Customer DID Details',
    component: () =>
        import(
            `@/pages/Dashboard/CustomerDidDetails.vue`
        ),
},
{
    path: '/CustomerOrderList',
    name: 'Customer Order List',
    component: () =>
        import(
            `@/pages/Dashboard/CustomerOrderList.vue`
        ),
},
{
    path: "/ViewOrderCustomerDetail",
    name: "Order Detail",
    component: () =>
        import(
            `@/pages/Dashboard/ViewOrderCustomerDetail.vue`
        ),
},
/* Dashboard - AccountDetails - UserProfile */
{
    path: '/AccountDetails',
    name: 'AccountDetails',
    component: () =>
        import(
            `@/pages/Dashboard/accountDetails/AccountDetails.vue`
        ),
},
{
    path: '/UserProfile',
    meta: {
        requiresAuth: true,
        requiresAdmin: true
    },
    name: '/UserProfile',
    props: (route) => ({
        type: route.query.type
    }),
    component: () =>
        import(
            /* webpackChunkName: "routes" */
            /* webpackMode: "lazy-once" */
            `@/pages/Dashboard/accountDetails/UserProfile.vue`
        ),
    children: [{
        path: "/Profile",
        name: "Profile",
        component: () =>
            import(
                /* webpackChunkName: "routes" */
                /* webpackMode: "lazy-once" */
                `@/pages/Dashboard/accountDetails/Profile.vue`
            ),
    },
    {
        path: "/Security",
        name: "Security",
        component: () =>
            import(
                /* webpackChunkName: "routes" */
                /* webpackMode: "lazy-once" */
                `@/pages/Dashboard/accountDetails/Security.vue`
            ),
    },

    ]
},
{
    path: "/OutboundInboundLimits",
    name: "Customer Devices list",
    component: () =>
        import(
            /* webpackChunkName: "routes" */
            /* webpackMode: "lazy-once" */
            `@/pages/Dashboard/accountDetails/OutboundInboundLimits.vue`
        ),
},
{
    path: "/CallHistory",
    name: "Call History",
    component: () =>
        import(
            /* webpackChunkName: "routes" */
            /* webpackMode: "lazy-once" */
            `@/pages/Dashboard/accountDetails/CallHistory.vue`
        ),
},
{
    path: "/OutboundInboundEdit",
    name: "Outbound Inbound Edit",
    component: () =>
        import(
            /* webpackChunkName: "routes" */
            /* webpackMode: "lazy-once" */
            `@/pages/Dashboard/accountDetails/OutboundInboundEdit.vue`
        ),
},
{
    path: "/WalletBalance",
    name: "Wallet Balance",
    component: () =>
        import(
            /* webpackChunkName: "routes" */
            /* webpackMode: "lazy-once" */
            `@/pages/Dashboard/accountDetails/WalletBalance.vue`
        ),
},
{
    path: "/DidCallLimits",
    name: "Did Call Limits",
    component: () =>
        import(
            /* webpackChunkName: "routes" */
            /* webpackMode: "lazy-once" */
            `@/pages/Dashboard/accountDetails/DidCallLimits.vue`
        ),
},
{
    path: "/MoreOrderDetail",
    name: "Number Details",
    component: () =>
        import(
            /* webpackChunkName: "routes" */
            /* webpackMode: "lazy-once" */
            `@/pages/Dashboard/MoreOrderDetail.vue`
        ),
},
/* Dashboard - BillingAccountTransactions */
{
    path: "/BillingAccountTransactions",
    name: "Billing Account Transactions",
    component: () =>
        import(
            /* webpackChunkName: "routes" */
            /* webpackMode: "lazy-once" */
            `@/pages/Dashboard/BillingAccountTransactions.vue`
        ),
},
{
    path: '/sip',
    name: 'Recieve Did',
    component: () =>
        import(
            `@/pages/RecieveDID/sip.vue`
        ),
    beforeEnter: ifAuthenticated
},
{
    path: '/rateupload',
    name: 'Rate Upload',
    component: () =>
        import(
            `@/pages/RateUpload/rateUpload.vue`
        ),
    beforeEnter: ifAuthenticated
},
{
    path: '/taskDetail',
    name: 'Task Detail',
    component: () =>
        import(
            `@/pages/RateUpload/taskDetail.vue`
        ),
    beforeEnter: ifAuthenticated
},
{
    path: '/bulkCostEdit',
    name: 'Cost Edit',
    component: () =>
        import(
            `@/pages/CostEdit/bulkCostEdit.vue`
        ),
    beforeEnter: ifAuthenticated
},
// {
//     path: '/inboundCarrier',
//     name: 'Inbound Carrier',
//     component: () =>
//         import (
//             `@/pages/InboundCarrier/inboundCarrier.vue`
//         ),
//     beforeEnter: ifAuthenticated
// },
// {
//     path: '/outboundCarrier',
//     name: 'Outbound Carrier',
//     component: () =>
//         import (
//             `@/pages/OutboundCarrier/outboundCarrier.vue`
//         ),
//     beforeEnter: ifAuthenticated
// },
{
    path: '/carrier',
    name: 'Carrier',
    component: () =>
        import(
            `@/pages/Carrier/carrier.vue`
        ),
    beforeEnter: ifAuthenticated
},
{
    path: '/addOutboundCarrier',
    name: 'addOutboundCarrier',
    component: () =>
        import(
            `@/pages/Carrier/addOutboundCarrier.vue`
        ),
    beforeEnter: ifAuthenticated
},
{
    path: '/Channel',
    name: 'Channel',
    component: () =>
        import(
            `@/pages/Channel/channel.vue`
        ),
    beforeEnter: ifAuthenticated
},
{
    path: '/productstore',
    name: 'Product Store',
    component: () =>
        import(
            `@/pages/ProductStore/ProductStore.vue`
        ),
    beforeEnter: ifAuthenticated
},
{
    path: '/shoppingcart',
    name: 'Shopping Cart',
    component: () =>
        import(
            `@/pages/ShoppingCart/shoppingcart.vue`
        ),
    beforeEnter: ifAuthenticated
},
{
    path: '/profileimage',
    name: 'Profile Image',
    component: () =>
        import(
            `@/pages/ProfileImage/profileimage.vue`
        ),
    beforeEnter: ifAuthenticated
},

// {
//     path: '/order/:orderId',
//     name: 'Orders Detail',
//     component: () =>
//         import (
//             `@/pages/Orders/ordersdetail.vue`
//         ),
//     beforeEnter: ifAuthenticated
// },
{
    path: '/callflow',
    name: 'Launch DID',
    component: () =>
        import(
            `@/pages/CallFlow/callflow.vue`
        ),
    beforeEnter: ifAuthenticated
},
{
    path: '/ticket',
    name: 'Ticket',
    component: () =>
        import(
            `@/pages/Ticket/ticket.vue`
        ),
    beforeEnter: ifAuthenticated
},
{
    path: '/documentRequest',
    name: 'Document Request',
    component: () =>
        import(
            `@/pages/DocumentRequest/documentRequest.vue`
        ),
    beforeEnter: ifAuthenticated
},
{
    path: '/doclist',
    name: 'Doc list',
    component: () =>
        import(
            `@/pages/DocumentRequest/docList.vue`
        ),
    beforeEnter: ifAuthenticated
},
{
    path: '/ratelist',
    name: 'Rate List',
    component: () =>
        import(
            `@/pages/RateList/ratelist.vue`
        ),
    beforeEnter: ifAuthenticated
},
{
    path: '/ratelist/:rateId',
    name: 'Rate Detail',
    component: () =>
        import(
            `@/pages/RateList/rateListDetail.vue`
        ),
    beforeEnter: ifAuthenticated
},
{
    path: '/billingAcc',
    name: 'Billing Account',
    component: () =>
        import(
            `@/pages/billingAccount/recharge.vue`
        ),
    beforeEnter: ifAuthenticated
},
{
    path: '/transaction',
    name: 'Transaction Details',
    component: () =>
        import(
            `@/pages/billingAccount/transaction.vue`
        ),
    beforeEnter: ifAuthenticated
},
{
    path: '/payment',
    name: 'Payment',
    component: () =>
        import(
            `@/pages/billingAccount/payment.vue`
        ),
    beforeEnter: ifAuthenticated
},
{
    path: '/orderCancel',
    name: 'Order Cancel',
    component: () =>
        import(
            `@/pages/billingAccount/orderCancel.vue`
        ),
    beforeEnter: ifAuthenticated
},
{
    path: '/livecall',
    name: 'Live Call',
    component: () =>
        import(
            `@/pages/LiveCall/livecall.vue`
        ),
    beforeEnter: ifAuthenticated
},
{
    path: '/ipLocation',
    name: 'IP Location',
    component: () =>
        import(
            `@/pages/Dashboard/accountDetails/ipLocation.vue`
        ),
    beforeEnter: ifAuthenticated
},
{
    path: '/uplaodedDocuments',
    name: 'Uplaoded Documents',
    component: () =>
        import(
            `@/pages/Dashboard/accountDetails/uplaodedDocument.vue`
        ),
    beforeEnter: ifAuthenticated
},
{
    path: '/smsLog',
    name: 'Inbound SMS Log',
    component: () =>
        import (
            `@/pages/Dashboard/accountDetails/smsLog.vue`
        ),
    beforeEnter: ifAuthenticated
},
    // {
    //     path: '/numberManager',
    //     name: 'Number Manager',
    //     component: () =>
    //         import (
    //             `@/pages/numberManager/numberManager.vue`
    //         ),
    //     beforeEnter: ifAuthenticated
    // },
    // {
    //     path: '/orderDetails/:id',
    //     name: 'Order Details',
    //     component: () =>
    //         import (
    //             `@/pages/billingAccount/orderDetails.vue`
    //         ),
    //     beforeEnter: ifAuthenticated
    // },
    // {
    //     path: '/device/',
    //     name: 'Device',
    //     component: () =>
    //         import (
    //             `@/pages/Device/device.vue`
    //         ),
    //     beforeEnter: ifAuthenticated
    // }

];