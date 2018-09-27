// import { getItem,putItem, addItem,deleteItem} from '@/services/article';
import { getItem } from '@/services/article';

export default {
    namespace: 'article',

    state: {
        list: [],
    },

    effects: {
        *fetch({ payload, callback }, { call, put }) {
            const response = yield call(getItem, payload);
            yield put({
                type: 'saveList',
                payload: Array.isArray(response) ? response : [],
            });
            if (callback) callback();
        },
    },

    reducers: {
        saveList(state, action) {
            return {
                ...state,
                list: action.payload,
            };
        },
    },
};
