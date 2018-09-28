import request from '@/utils/request';

export async function getMap(params) {
    return request(`/api/map/get`,{
        method:'POST',
        body:params,
    });
}


