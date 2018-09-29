import request from '@/utils/request';

export async function getItem(params,namespace) {
    return request(`/api/${namespace}/get`,{
        method:'POST',
        body:params,
    });
}

export async function putItem(params,namespace) {
    return request(`/api/${namespace}/put`, {
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

export async function deleteItem(params,namespace) {
    return request(`/api/${namespace}/delete/${params.id}`, {
        method: 'DELETE',
    });
}
