import React, { PureComponent } from 'react';
import { Card, Button, Form, Icon, Col, Row, Popover } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from './../../layouts/PageHeaderLayout';
import FooterToolbar from './../../components/FooterToolbar';
import styles from '../Form.less';
import { renderFormInput } from '../../components/_utils/input';
import { filterFalse } from '../../utils/utils';

const formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
};
const namespace = 'article';
const typeDescMap = {
    add: '新增',
    edit: '修改',
    view: '查看',
};
const getDesc = type => `${typeDescMap[type] || ''}文章`;

const getInputs = (editFlag) => [
    {
        key: 'title',
        label: '标题',
        required: true,
        disabled: editFlag,
    },
    {
        key:'content',
        label:'内容',
        required: true,
    },
    {
        key: 'type',
        label: '类型',
        required: true,
    },
    {
        key: 'author',
        label: '作者',
        required: true,
        disabled: editFlag,
    },
    {
        key: 'browser',
        label: '浏览量',
        type: 'Number',
        disabled: editFlag,
    },
    {
        key: 'introduction',
        label: '介绍',
    },
    {
        key: 'tag',
        label: '标签',
    }
];

@connect(({ global, loading, article }) => ({
    record: article.record,
    pageType: article.pageType,
    collapsed: global.collapsed,
    addSubmitting: loading.effects['article/add'],
    editSubmitting: loading.effects['article/edit'],
}))
@Form.create()
export default class AgvForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            record: props.record,
            width: '100%',
        };
    }
    componentDidMount() {
        window.addEventListener('resize', this.resizeFooterToolbar);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeFooterToolbar);
    }
    resizeFooterToolbar = () => {
        const sider = document.querySelectorAll('.ant-layout-sider')[0];
        const width = !!sider?`calc(100% - ${sider.style.width})`:"100%"
        if (this.state.width !== width) {
            this.setState({ width });
        }
    };
    validate = () => {
        const { dispatch, form: { validateFieldsAndScroll } } = this.props;
        const me = this;
        validateFieldsAndScroll((error, values) => {
            const params = values;
            console.warn('values', values);
            if (!error) {
                // 处理参数
                // submit the values
                let id = me.state.record && me.state.record.id?me.state.record.id:false;
                let type = id?namespace +"/" +"edit":namespace +"/" +"add";
                params.id =id;
                filterFalse(params);
                dispatch({
                    type,
                    payload: {
                        params,
                        namespace,
                    },
                });
            }
        });
    };
    scrollToField = (fieldKey) => {
        const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
        if (labelNode) {
            labelNode.scrollIntoView(true);
        }
    };
    goBack = () => {
        this.props.dispatch(routerRedux.goBack());
    };
    renderErrorInfo = (fieldLabels) => {
        const { form: { getFieldsError } } = this.props;
        const errors = getFieldsError();
        const errorCount = Object.keys(errors).filter(key => errors[key]).length;
        if (!errors || errorCount === 0) {
            return null;
        }
        const errorList = Object.keys(errors).map((key) => {
            if (!errors[key]) {
                return null;
            }
            return (
                <li key={key} className={styles.errorListItem} onClick={() => this.scrollToField(key)}>
                    <Icon type="cross-circle-o" className={styles.errorIcon} />
                    <div className={styles.errorMessage}>{errors[key][0]}</div>
                    <div className={styles.errorField}>{fieldLabels[key]}</div>
                </li>
            );
        });
        return (
            <span className={styles.errorIcon}>
        <Popover
            title="表单校验信息"
            content={errorList}
            overlayClassName={styles.errorPopover}
            trigger="click"
            getPopupContainer={trigger => trigger.parentNode}
        >
          <Icon type="exclamation-circle" />
        </Popover>
                {errorCount}
      </span>
        );
    };
    render() {
        const { form: { getFieldDecorator }, addSubmitting, editSubmitting, pageType } = this.props;
        const rows = [];
        const fieldLabels = {};
        getInputs(pageType === 'edit' || pageType === 'view').forEach((input) => {
            fieldLabels[input.key] = input.label;
            if (rows.length === 0 || rows[rows.length - 1].length === 2) {
                rows.push([input]);
                return;
            }
            rows[rows.length - 1].push(input);
        });
        return (
            <PageHeaderLayout
                title={getDesc(pageType)}
                wrapperClassName={styles.advancedForm}
            >
                <Card className={styles.card} bordered={false}>
                    <Form layout="horizontal">
                        {rows.map(row => (
                            <Row key={row.map(i => i.key).join('-')} gutter={8}>

                                {
                                    row.map(input => (
                                        <Col key={input.key} md={12} sm={24}>
                                            {renderFormInput(Object.assign({ formItemProps: formLayout, disabled: pageType === 'view' }, input), getFieldDecorator, this.state.record)}
                                        </Col>
                                    ))}
                            </Row>
                        ))}
                    </Form>
                </Card>

                <FooterToolbar style={{ width: this.state.width }}>
                    {/*{this.renderErrorInfo(fieldLabels)}*/}
                    <Button style={{ marginRight: 8 }} onClick={this.goBack}>返回</Button>
                    {pageType !== 'view' && (
                        <Button type="primary" onClick={this.validate} loading={pageType === 'edit'?editSubmitting:addSubmitting}>
                            提交
                        </Button>
                    )}
                </FooterToolbar>

            </PageHeaderLayout>
        );
    }
}
