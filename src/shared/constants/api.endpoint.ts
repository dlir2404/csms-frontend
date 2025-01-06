export enum ApiEndpoint {
    LOGIN = '/auth/login',
    GET_ME = '/auth/me',


    //product
    GET_PRODUCTS = '/product/all',
    CREATE_PRODUCT = '/product',
    EDIT_PRODUCT = '/product',
    DELETE_PRODUCT = '/product',


    //category
    GET_CATEGORIES = '/category/all',
    CREATE_CATEGORY = '/category',
    EDIT_CATEGORY = '/category',
    DELETE_CATEGORY = '/category',


    //order
    GET_ORDERS = '/order/all',
    GET_ORDER = '/order',
    CREATE_ORDER = '/order',
    CHANGE_ORDER_STATUS = '/order/status',
    PROCESS_ORDER = '/order/status',
    COMPLETE_ORDER = '/order/status',
}