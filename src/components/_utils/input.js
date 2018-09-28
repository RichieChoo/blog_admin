import React from 'react';
import moment from 'moment';
import { Input, Select, InputNumber, DatePicker, Checkbox, Switch, Form } from 'antd';
import EditTable from './../ARComponents/EditTable';
import FormUpload from './../ARComponents/FormUpload';
// import FileUpload from '../FormFileUpload';

const FormItem = Form.Item;
const { OptGroup, Option } = Select;
const { TextArea } = Input;

const renderOptions = options =>
  Array.isArray(options) &&
  options.map(option => (
    <Option value={option.value} key={option.value}>
      {option.label}
    </Option>
  ));

export const renderInput = (input) => {
  const { type, placeholder, options = [], optGroups = [], ...inputProps } = input;
  switch (type) {
    case 'Input':
    default:
      return <Input {...inputProps} placeholder={placeholder || '请输入'} />;
    case 'Select':
      return (
        <Select {...inputProps} placeholder={placeholder || '请选择'} style={{ width: '100%' }}>
          {renderOptions(options)}
          {optGroups.map(optGroup => (
            <OptGroup key={optGroup.key} label={optGroup.label}>
              {renderOptions(optGroups.options || [])}
            </OptGroup>
          ))}
        </Select>
      );
    case 'Number':
      return (
        <InputNumber
          {...inputProps}
          style={{ width: '100%' }}
          placeholder={placeholder || '请输入数字'}
        />
      );
    case 'Date':
      return (
        <DatePicker
          {...inputProps}
          style={{ width: '100%' }}
          placeholder={placeholder || '请输入日期'}
        />
      );
    case 'Checkbox':
      return <Checkbox {...inputProps} style={{ width: '100%' }} />;
    case 'Switch':
      return <Switch {...inputProps} />;
    case 'Upload':
      return <FormUpload {...inputProps} />;
    //   return <FileUpload {...inputProps} />;
    case 'Table':
      return <EditTable {...inputProps} />;
    case 'TextArea':
      return <TextArea {...inputProps} />;
  }
};
const isUnval = data => typeof data === 'undefined' || toString.call(data) === '[object Null]';

const formatData = ({ type, options }, data) => {
  const opts = Array.isArray(options) ? options : []; // eslint-disable-line
  // const res = opts.find(opt => opt.value === data || opt.value === String(data));
  switch (type) {
    case 'Input':
    default:
      return data;
    // case 'Select':
      // return (res && res.label) || data;
    case 'Number':
      return isUnval(data) ? data : Number(data);
    case 'Date':
      return isUnval(data) ? data : moment(data);
    case 'Table':
      return data || [];
  }
};

/**
 * 渲染formInput
 * @param {Object} input
 * @param {Function} getFieldDecorator
 * @param {Object} initData
 * @param {Object} inputsConfig
 * @returns {FiberNode} <FormItem><Input /></FormItem>
 */
export const renderFormInput = (input, getFieldDecorator, initData = {}, inputsConfig = {}) => {
  const {
    label,
    key,
    required,
    pattern,
    patternMsg,
    fieldOptions = {},
    formItemProps,
    ...inputIn
  } = { ...input, ...inputsConfig[input.key] };
  return (
    <FormItem label={label} {...formItemProps}>
      {getFieldDecorator(key, {
        ...fieldOptions,
        rules: [].concat(
          required ? { required: true, message: `${label} 为必填！` } : [],
          typeof pattern === 'string' || toString.call(pattern) === '[object RegExp]'
            ? { pattern: new RegExp(pattern), message: patternMsg || `${label} 校验失败` }
            : [],
          fieldOptions.rules || []
        ),
        initialValue: formatData(inputIn, initData[key]),
      })(renderInput(inputIn))}
    </FormItem>
  );
};

export const formatValue = (value, type) => {
  // 过滤事件
  const target = value && value.currentTarget;
  if (target instanceof Node) {
    return target.value;
  }
  switch (type) {
    default:
      return value;
    case 'Date':
      return value.valueOf();
    case 'Upload':
      return (value || []).map(file => file.name);
  }
};

/**
 * 渲染 table input
 * @param {Object} input
 * @param {Object} col
 * @param {Function} change
 * @param {Any} defaultValue
 * @param {Object} record
 * @param {Number} index
 * @returns {FiberNode} <Input/>
 */
export const renderTableInput = (input, col, change, defaultValue, record, index) => {
  return renderInput({
    ...input,
    defaultValue,
    onChange: (val, ...args) =>
      change(formatValue(val, input && input.type), col, record, index, ...args),
  });
};

export default renderInput;
