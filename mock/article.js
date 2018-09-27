const arr = [];
for (let i = 0; i < 46; i += 1) {
    const obj = {};
    obj.id = i + 1;
    obj.name = `Mock文章${i}${1}`;
    obj.content = `这是第${i}${1}文章内容`;
    obj.tag = ['标签1', '标签2'];
    obj.type = obj.id % 2 === 0 ? '技术' : '其他';
    obj.createTime = new Date();
    obj.pv = Math.round(Math.random() * 100);
    arr.push(obj);
}

function get(req, res) {
    res.send({
        success: true,
        message: 'MockData--获取列表成功',
        data: arr,
    });
}

export default {
    'GET /api/article/get': get,
};
