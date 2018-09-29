import { getItem,putItem, addItem,deleteItem} from '@/services/article';
import { getMapAndOptionsFromList } from './../../../utils/lang';
import { getMap } from '@/services/map';
import { routerRedux } from 'dva/router';
import { message } from 'antd';


export default {
    namespace: 'article',

    state: {
        data: {
            list: [],
            pagination: {},
        },
        articleType:{
            map:{},
            options:[]
        }
    },

    effects: {
        *fetch({ payload, callback }, { call, put }) {
            const response = yield call(getItem, payload.params,payload.namespace);
            if(response && response.success){
                const result = {
                    list: (response.data && response.data.list) || [],
                    pagination: {
                        current: payload.params.pageNum,
                        pageSize: payload.params.pageSize,
                        total: (response.data && response.data.total) || 0,
                    },
                };
                yield put({
                    type: 'save',
                    payload: result,
                });
                if(callback) callback();
            }else {
                message.error("列表加载失败")
            }

        },
        *getArticleType({ payload }, { call, put }) {
            const response = yield call(getMap, payload);
            if (response && response.success) {
                yield put({
                    type: 'setArticleType',
                    payload: response.data,
                });
            }
        },
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                data: action.payload,
            };
        },
        setArticleType(state, action) {
            return {
                ...state,
                articleType: getMapAndOptionsFromList(action.payload, 'key', 'value'),
            };
        },
    },
};
