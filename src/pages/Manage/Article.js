import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import { Card, Form, Upload, Button, message, Modal } from 'antd';
import StandardTable from './../../components/StandardTable';
import BasicSearch from './../../components/ARComponents/BasicSearch'
import PageHeaderLayout from './../../layouts/PageHeaderLayout';
import { boolRender, btnRenderFactory, btnRender, enableRender } from './../../utils/render';
import styles from './Article.less';

const namespace = 'article';

const simpleConditions = [
    {
        label: '文章ID',
        key: 'id',
    }, {
        label: '文章名称',
        key: 'name',
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
                ...params,
                namespace,
            },
        });
        dispatch({
            type:'/api/map/get',
            payload:{
                name:'ARTICLE_TYPE'
            }
        })
    };

    articleTypeRender = (val)=>{
        if(this.props[namespace]&&this.props[namespace].articleType){
            const { articleType: { map } } = this.props[namespace];
            return map[val] || val;
        }
    }
    handleStandardTableChange = (pagination, /* filtersArg, sorter */) => {
        const { dispatch } = this.props;
        const { formValues } = this.state;

        const params = {};
        params.pageNum = pagination.current;
        params.pageSize = pagination.pageSize;
        params.query = formValues;

        dispatch({
            type: `${namespace}/fetch`,
            payload: params,
        });
    }

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
    }

    goFormFactory = (type, noRecord) => (record) => {
        this.props.dispatch({
            type: `${namespace}/goFormPage`,
            payload: {
                type,
                record: noRecord ? '' : record,
            },
        });
    };

    columns = [
        {
            title: '文章Id',
            dataIndex: 'id',
            key: 'id',
            width: 100,
        },{
            title: '文章标题',
            dataIndex: 'name',
            key: 'name',
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
            title: '浏览量',
            width: 200,
            dataIndex: 'pv',
            key: 'pv',
        },
        {
            title: '创建时间',
            width: 200,
            dataIndex: 'createTime',
            key: 'createTime',
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
                    callback: this.deleteItem,
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
            label: '删除',
            callback: () => this.deleteItemSelected(),
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
                        columnWidth = {1200}
                        scroll={{ x: 1600 }}
                    />
                </div>
            </Card>
        </PageHeaderLayout>;
    }
}

export default AppComponent;
