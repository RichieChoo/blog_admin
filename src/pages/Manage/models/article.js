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
            const response = yield call(getMap, payload.params,payload.namespace);
            if (response && response.success) {
                yield put({
                    type: 'setArticleType',
                    payload: response.data,
                });
            }
        },
        *deleteItem({ payload, callback }, { call, put }) {
            const response = yield call(deleteItem, payload.params,payload.namespace);
            if (response && response.success) {
                let {successNum,failNum} = response.data;
                let msg1 = successNum===0?"":successNum+"篇文章成功";
                let msg2 = failNum===0?"":failNum+"篇文章失败";
                let msg = "删除"+msg1+msg2;
                message.success(msg);
                yield put({
                    type: 'save',
                    payload: response,
                });
                if(callback) callback();
            } else {
                message.error(`删除失败:${(response && response.msg) || ''}`);
            }
        },
        *goForm({ payload, callback }, { put }) {
            yield put({
                type: 'setRecord',
                payload,
            });
            yield put(routerRedux.push('/manage/article/form'));
            if (callback) callback();
        },
        *edit({ payload }, { call, put }) {
            const res = yield call(putItem, payload.params,payload.namespace);
            if (res && res.success) {
                message.success('提交成功');
                yield put({
                    type: 'save',
                    payload: res,
                });
                yield put(routerRedux.push('/manage/article'));
            } else {
                message.error(`提交失败:${(res && res.msg) || ''}`);
            }
        },
        *add({ payload }, { call, put }) {
            const res = yield call(addItem, payload.params,payload.namespace);
            if (res && res.success) {
                message.success('提交成功');
                yield put(routerRedux.push('/manage/article'));
            } else {
                message.error(`提交失败:${(res && res.msg) || ''}`);
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
        setRecord(state, action) {
            return {
                ...state,
                record: action.payload.record,
                pageType: action.payload.type,
            };
        },
    },
};
