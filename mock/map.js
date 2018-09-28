/**
 * Created by Richie on 18-9-28
 */
function getMaps(req, res) {
    const {
        body,
    } = req;
    const mockMap = {
        ARTICLE_TYPE: [{
            key: '技术',
            value: 1,
        }, {
            key: '其他',
            value: 2,
        }]
    };
    let mockData;
    switch (body.name) {
        case 'ARTICLE_TYPE':
            mockData = mockMap.ARTICLE_TYPE;
            break;
        default:
            mockData = mockMap.ARTICLE_TYPE;
    }
    res.send({
        success: true,
        message: 'MockData-獲取下拉MAP成功',
        data: mockData,
    });
}

export default {
    'POST /api/map/get': getMaps,
};
