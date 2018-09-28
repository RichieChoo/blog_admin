import React, { PureComponent } from 'react';
import { Upload, Button, Icon } from 'antd';

export default class FormUpload extends PureComponent {
  render() {
    const { value, onChange, ...innerProps } = this.props;
    const list = value ? [value] : [];
    return (
      <Upload
        fileList={list}
        onChange={({ file }) => {
          // console.log(file);
          onChange(file);
        }}
        {...innerProps}
        beforeUpload={() => false}
      >
        <Button>
          <Icon type="upload" /> 点击上传
        </Button>
      </Upload>
    );
  }
}
