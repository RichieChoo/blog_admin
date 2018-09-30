import request from '@/utils/request';

export async function getItem(params,namespace) {
    return request(`/api/${namespace}/get`,{
        method:'POST',
        body:params,
    });
}

export async function putItem(params,namespace) {
    return request(`/api/${namespace}/edit/${params.id}`, {
        method: 'PUT',
        body: {
            ...params,
        },
    });
}

export async function addItem(params,namespace) {
    return request(`/api/${namespace}/add`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//删除单个和多个用同一个接口，且是软删除
export async function deleteItem(params,namespace) {
    return request(`/api/${namespace}/delete`, {
        method: 'POST',
        body: {
            ids:params,
        },
    });
}

