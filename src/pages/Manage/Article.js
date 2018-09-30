import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import { Card, Form, Table,Upload, Button, message, Modal } from 'antd';
import StandardTable from './../../components/StandardTable';//当列固定时，对应的已做修改。
import BasicSearch from './../../components/ARComponents/BasicSearch'
import PageHeaderLayout from './../../layouts/PageHeaderLayout';
import { boolRender, btnRenderFactory, btnRender, enableRender } from './../../utils/render';
import styles from '../List.less';

const namespace = 'article';
const single=true;
const simpleConditions = [
    {
        label: '文章ID',
        key: 'id',
    }, {
        label: '文章标题',
        key: 'title',
    },
];

const advancedConditions = [
    {
        label: '类型',
        key: 'type',
        type: 'Select',
        options: [
            {
                label: '其他',
                value: 1,
            },
            {
                label: '技术',
                value: 0,
            },
        ],
    },
];

const FormItem = Form.Item;




@connect(({article,loading}) => ({
    article,
    loading:loading.models.article,
}))
@Form.create()

class AppComponent extends PureComponent {

    state = {
        selectedRows: [],
        formValues: {},
    };

    componentDidMount() {
        const params = {
            pageNum: 1,
            pageSize:10,
            query:{}
        };
        this.fetchList(params);
    }

    getSimpleConditions() {
        const { articleType: { options } } = this.props[namespace];
        simpleConditions[1].options = options;
        return simpleConditions;
    }

    fetchList = params => {
        const {dispatch} = this.props;
        dispatch({
            type: `${namespace}/fetch`,
            payload: {
                params,
                namespace,
            },
        });
        // dispatch({
        //     type:'/api/map/get',
        //     payload:{
        //         name:'ARTICLE_TYPE'
        //     }
        // })
    };

    articleTypeRender = (val)=>{
        if(this.props[namespace]&&this.props[namespace].articleType){
            const { articleType: { map } } = this.props[namespace];
            return map[val] || val;
        }
    };


    handleStandardTableChange = (pagination, /* filtersArg, sorter */) => {
        const { formValues } = this.state;

        const params = {};
        params.pageNum = pagination.current;
        params.pageSize = pagination.pageSize;
        params.query = formValues;
        this.fetchList(params);
    };

    handleSelectRows = (rows) => {
        this.setState({
            selectedRows: rows,
        });
    }

    handleSearch = (fieldsValue) => {
        this.setState({
            formValues: fieldsValue,
        });
        const params = {};
        params.pageNum = 1;
        params.pageSize = 10;
        params.query = fieldsValue;
        for (const i in params.query) {
            if (params.query.hasOwnProperty(i)) { // eslint-disable-line
                const element = params.query[i];
                if (!element) {
                    if (element !== 0) {
                        delete params.query[i];
                    }
                }
            }
        }
        this.fetchList(params)
    };

    goFormFactory = (type, noRecord) => (record) => {
        this.props.dispatch({
            type: `${namespace}/goForm`,
            payload: {
                type,
                record: noRecord ? '' : record,
            },
        });
    };

    //删除单个和多个用同一个接口，且是软删除
    deleteItem = (record,single) => {
        const ids =[];
        if(single){
            ids.push(record.id)
        }else {
            this.state.selectedRows.forEach((v)=>{
                ids.push(v.id)
            })
        }
        const length = ids.length === 0 ? '' : `${ids.length}篇`;
        const infoText = single?`确认删除${record.title}的文章吗？`:`确认删除选中的${length}文章吗？`;
        const { dispatch } = this.props;


        Modal.confirm({
            title: '操作提醒',
            content: infoText,
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onCancel: () => {},
            onOk: () => {
                dispatch({
                    type: `${namespace}/deleteItem`,
                    payload: {
                        params:ids,
                        namespace
                    },
                    callback: () => {
                        this.setState({
                            selectedRows: [],
                        });
                        this.fetchList({
                            pageNum: 1,
                            pageSize:10,
                            query:{}
                        });
                    },
                });
            },
        });
    };
    columns = [
        {
            title: '文章Id',
            dataIndex: 'id',
            fixed:'left',
            key: 'id',
            width: 100,
        },{
            title: '文章标题',
            dataIndex: 'title',
            key: 'title',
            width: 200,
        },
        {
            title: '文章内容',
            dataIndex: 'content',
            width: 300,
            key: 'content',
        },
        {
            title: '文章类型',
            dataIndex: 'type',
            width: 200,
            key: 'type',
            render: this.articleTypeRender,
        },
        {
            title: '文章介绍',
            dataIndex: 'introduction',
            width: 200,
            key: 'introduction',
        },
        {
            title: '浏览量',
            dataIndex: 'browser',
            width: 200,
            key: 'browser',
        },

        {
            title: '作者',
            width: 200,
            dataIndex: 'author',
            key: 'author',
        },
        {
            title: '创建时间',
            width: 300,
            dataIndex: 'createdAt',
            key: 'createdAt',
        },{
            title: '标签',
            width: 200,
            dataIndex: 'tag',
            key: 'tag',
        },
        {
            title: '操作',
            fixed: 'right',
            width: 200,
            render: btnRenderFactory([
                {
                    label: '查看',
                    callback: this.goFormFactory('view'),
                    key: 'view',
                },
                {
                    label: '编辑',
                    callback: this.goFormFactory('edit'),
                    key: 'edit',
                },
                {
                    label: '删除',
                    callback: (record,single)=>this.deleteItem(record,single),
                    key: 'del',
                },
            ], this),
        },
    ];
    btns = [
        {
            label: '新增',
            icon: 'plus',
            key: 'new',
            type: 'primary',
            callback: this.goFormFactory('add', true),
        }
    ];
    selectBtns = [
        {
            icon: 'delete',
            key: 'del',
            type: 'danger',
            label: '删除',
            callback:()=>this.deleteItem(),
        },
    ];

    render() {
        const { article: { data }, loading } = this.props;
        const { selectedRows } = this.state;
        return <PageHeaderLayout title="文章列表">
            <Card bordered={false}>
                <div className={styles.tableList}>
                    <div className={styles.tableListForm}>
                        <BasicSearch
                            simpleConditions={this.getSimpleConditions()}
                            advanceConditions={advancedConditions}
                            search={this.handleSearch}
                        />
                    </div>
                    <div className={styles.tableListOperator}>
                        {btnRender(this.btns)}
                        {
                            selectedRows.length > 0 && btnRender(this.selectBtns)
                        }
                    </div>
                    <StandardTable
                        selectedRows={selectedRows}
                        loading={loading}
                        data={data}
                        columns={this.columns}
                        onSelectRow={this.handleSelectRows}
                        onChange={this.handleStandardTableChange}
                        rowKey="id"
                        scroll={{ x: 2100 }}
                    />
                </div>
            </Card>
        </PageHeaderLayout>;
    }
}

export default AppComponent;
