import React, { PureComponent } from 'react';

import { Row, Col, Form, Icon, Button } from 'antd';

import styles from './index.less';

import { renderFormInput } from './../../_utils/input';

@Form.create()
export default class BasicSearch extends PureComponent {
  state = {
    expandForm: false,
  };
  // componentWillUnmount() {}

  handleFormReset = () => {
    const { form, search } = this.props;
    form.resetFields();
    search({});
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  handleSearch = (e) => {
    e.preventDefault();

    const { search, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      // const values = {
      //   ...fieldsValue,
      //   updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      // };
      const values = {};
      Object.keys(fieldsValue).forEach((key) => {
        const value = fieldsValue[key];
        if (typeof value === 'undefined' || toString.call(value) === '[object Null]') {
          return;
        }
        if (typeof value === 'object' && typeof value.valueOf === 'function') {
          values[key] = value.valueOf();
          return;
        }
        values[key] = value;
      });
      search(values);
    });
  };
  renderForm(inputs, expand, searchData, inputsConfig) {
    const { getFieldDecorator } = this.props.form;
    const rows = [];
    const rowSize = 3;
    const inputSize = Math.round(24 / rowSize);
    const submit = (
      <div style={{ overflow: 'hidden' }}>
        <span style={{ float: 'right', marginBottom: 24 }}>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
            重置
          </Button>
          <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
            {expand ? '收起' : '展开'}
            <Icon type={expand ? 'up' : 'down'} />
          </a>
        </span>
      </div>
    );
    for (let i = 0; i < inputs.length; i += rowSize) {
      const row = inputs.slice(i, i + rowSize);
      rows.push(
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} key={row.map(input => input.key).join('_')}>
          {row.map(input => (
            <Col md={inputSize} sm={24} key={input.key}>
              {renderFormInput(input, getFieldDecorator, searchData, inputsConfig)}
            </Col>
          ))}
          {row.length < rowSize && (
            <Col md={{ span: inputSize, offset: (rowSize - 1 - row.length) * inputSize }} sm={24}>
              {submit}
            </Col>
          )}
        </Row>
      );
    }
    if (inputs.length % rowSize === 0) {
      rows.push(submit);
    }
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        {rows}
      </Form>
    );
  }
  render() {
    const { simpleConditions = [], advanceConditions = [], searchData, inputsConfig } = this.props;
    const { expandForm } = this.state;
    const conditions = expandForm ? [...simpleConditions, ...advanceConditions] : simpleConditions;
    return (
      <div className={styles.searchForm}>
        {this.renderForm(conditions, expandForm, searchData, inputsConfig)}
      </div>
    );
  }
}
