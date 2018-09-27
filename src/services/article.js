import request from '@/utils/request';

export async function getItem() {
    return request('/api/article/get');
}

export async function putItem(params) {
    return request('/api/article/put', {
        method: 'PUT',
        body: {
            ...params,
        },
    });
}

export async function addItem(params) {
    return request('/api/article/add', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function deleteItem(params) {
    return request(`/api/article/delete/${params.id}`, {
        method: 'DELETE',
    });
}
