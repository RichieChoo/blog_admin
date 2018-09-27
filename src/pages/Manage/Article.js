import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form } from 'antd';
// import style from './Article.less';

// const FormItem = Form.Item;

@connect(article => ({
    article,
}))
@Form.create()
class AppComponent extends PureComponent {
    componentDidMount() {
        this.fetchList();
    }

    fetchList = params => {
        const { dispatch } = this.props;
        if (!params) {
            dispatch({
                type: 'article/fetch',
            });
        } else {
            dispatch({
                type: 'article/fetch',
                payload: params,
            });
        }
    };

    handleSubmit = e => {
        const { form } = this.props;
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.fetchList(values);
            }
        });
    };

    render() {
        return <Fragment>ARTICLE HOME</Fragment>;
    }
}

export default AppComponent;
