import React from 'react';
import { Table, Divider, Button } from 'antd';
import { renderTableInput } from './../../_utils/input';
import styles from './styles.less';
import { formatRender } from './../../_utils/render';

const getKey = (record, index, rowKey) => record[rowKey] || index;

export default class EditTable extends React.PureComponent {
  state = {
    transCol: [],
    editData: {},
    editFlags: {},
  };
  componentWillMount() {
    this.setState({
      transCol: this.format(this.props.columns, this.props),
    });
  }
  componentWillReceiveProps(nextProps) {
    if (Array.isArray(nextProps.columns)) {
      this.setState({
        transCol: this.format(nextProps.columns, nextProps),
      });
    }
    // if(Array.isArray(nextProps.value)) {
    //   this.setState({
    //     editFlags: {},
    //   });
    // }
  }
  onChange = (...args) => {
    const { onChange } = this.props;
    if (typeof onChange === 'function') {
      onChange(...args);
    }
  };
  format = (columns, props) => {
    const { hasEditBtn, hasDelBtn, rowKey } = props;
    const transCols = columns.map((col) => {
      const { input, ...transCol } = col;
      if (col.editable) {
        transCol.render = (text, record, index) => {
          const { editFlags, editData } = this.state;
          const key = getKey(record, index, rowKey);
          if (editFlags[key]) {
            return renderTableInput(
              input,
              col,
              this.handleItemInput,
              editData[key] && editData[key][col.dataIndex],
              record,
              index
            );
          } else {
            return formatRender(col.render, text, { record, index }, props);
          }
        };
      }
      // 转译render
      if (typeof col.render !== 'undefined') {
        if (typeof col.render === 'string') {
          transCol.render = val => col.render.replace('%', val);
        } else {
          transCol.render = (text, record, index) =>
            formatRender(col.render, text, { record, index }, props);
        }
      }
      // 转译filter
      // if (typeof col.filter !== 'undefined') {
      //   transCol.onFilter = (value, record) => { console.log(record, value);
      // return record.status.toString() === value};
      // }
      return transCol;
    });
    if (hasEditBtn || hasDelBtn) {
      transCols.push({
        title: '操作',
        render: (val, record, index) => {
          const { editFlags } = this.state;
          const editFlag = editFlags[getKey(record, index, rowKey)];
          const { start, submit, cancel, del } = this.itemBtnFactory(
            record,
            index,
            hasEditBtn,
            hasDelBtn,
            editFlag === 2
          );

          return hasEditBtn && editFlag ? (
            <>'
             '<a onClick={submit}>完成</a>'
             '<Divider type="vertical" />'
             '<a onClick={cancel}>取消</a>'
           '</>
          ) : (
            <>'
             '{hasEditBtn && <a onClick={start}>编辑</a>}'
             '{hasEditBtn && hasDelBtn && <Divider type="vertical" />}'
             '{hasDelBtn && <a onClick={del}>删除</a>}'
           '</>
          );
        },
      });
    }
    return transCols;
  };
  itemBtnFactory = (record, index, hasEditBtn, hasDelBtn, addFlag) => {
    const { rowKey } = this.props;
    const key = getKey(record, index, rowKey);
    const methods = {};
    if (hasEditBtn) {
      methods.start = () => this.startEdit(key, record);
      methods.cancel = () => {
        this.setState(({ editFlags }) => ({
          editFlags: {
            ...editFlags,
            [key]: false,
          },
        }));
        if (addFlag) {
          const { value } = this.props;
          this.onChange([...value.slice(0, index), ...value.slice(index + 1)]);
        }
      };
      methods.submit = () => {
        const { editData } = this.state;
        const { value } = this.props;
        methods.cancel();
        this.onChange([...value.slice(0, index), editData[key], ...value.slice(index + 1)]);
      };
    }
    if (hasDelBtn) {
      methods.del = () => {
        const { value } = this.props;
        this.onChange([...value.slice(0, index), ...value.slice(index + 1)]);
      };
    }
    return methods;
  };
  startEdit = (key, record, addFlag) => {
    this.setState({
      editFlags: {
        ...this.state.editFlags,
        [key]: addFlag ? 2 : true,
      },
      editData: {
        ...this.state.editData,
        [key]: record,
      },
    });
  };
  addRow = () => {
    const { defaultData, value, rowKey } = this.props;
    const key = getKey(defaultData, value && value.length, rowKey);
    const record = { ...defaultData, [rowKey]: key };
    this.onChange([...value, record]);
    this.startEdit(key, record, true);
  };
  handleItemInput = (value, col, record, index) => {
    const { editData } = this.state;
    const { rowKey } = this.props;
    const key = getKey(record, index, rowKey);
    this.setState({
      editData: {
        ...editData,
        [key]: {
          ...editData[key],
          [col.dataIndex]: value,
        },
      },
    });
  };
  render() {
    const {
      value,
      columns,
      searchData,
      dispatch,
      hasEditBtn,
      hasDelBtn,
      hasAddBtn,
      onChange,
      ...props
    } = this.props;
    const { transCol } = this.state;
    return (
      <div className={styles.editTableWrapper}>
        <Table dataSource={value} columns={transCol} pagination={false} {...props} />
        {hasAddBtn && (
          <Button
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            type="dashed"
            onClick={this.addRow}
            icon="plus"
          >
            新增
          </Button>
        )}
      </div>
    );
  }
}
EditTable.defaultProps = {
  rowKey: 'id',
  defaultData: {},
  hasEditBtn: true,
  hasDelBtn: true,
  hasAddBtn: true,
};
