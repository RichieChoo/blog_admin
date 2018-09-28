import React from 'react';
import moment from 'moment';
import { Badge } from 'antd';
// import { importFactory } from '../../utils/import';
// import ButtonOperator from '../ButtonOperator';
// import antd from '../../utils/antd';
// import

// const Fragment = 'Fragment';
// const importComp = importFactory(Symbol.for('components'));

/**
 * @deprecated
 * @param {*} config
 * @param {*} val
 * @param {*} originVal
 * @param {*} data
 * @param {*} props
 */
// const gengerateComps = ({ component, props, valProps, children }, val, originVal) => {
//   if (!component || typeof component !== 'string') {
//     return '';
//   }
//   const C = component === Fragment ? React.Fragment : antd[component] || importComp(component);
//   const Comp = C === Fragment ? React.Fragment : C;
//   const calProps = props || {};
//   if (Array.isArray(valProps)) {
//     valProps.forEach(({ key, origin, render }) => {
//       if (typeof key === 'string' && key) {
//         const temp = origin ? originVal : val;
//         calProps[key] = formatRender(render, temp);
//       }
//     });
//   }
//   return (
//   <Comp {...calProps}>{(children || []).map(child => gengerateComps(child, val, origin))}</Comp>
//   );
// };

/**
 * 渲染 renders为值
 * @param {Render|Render[]} renders
 * @param {Any} value 初始值
 * @param {Object} data 默认数据
 * @param {Object} props 组件props
 * @returns {FiberNode|String} reactNode
 */
export const formatRender = (renders, value /* , data, props */) => {
  const rs = Array.isArray(renders) ? renders : renders && renders.type ? [renders] : [];
  return rs.reduce((res, { type, format, config }) => {
    switch (type) {
      case 'String':
        return format.replace('%', res);
      case 'Date':
        return moment(res).format(format);
      case 'Map':
        return format[res] || res;
      case 'Status':
        return (
          <Badge
            text={config && config.textMap && config.textMap[res]}
            status={config && config.statusMap && config.statusMap[res]}
          />
        );
      // case 'Operation':
      //   return (
      //     <ButtonOperator
      //       dispatch={props.dispatch}
      //       buttonMaxNum={3}
      //       buttonData={data}
      //       {...config}
      //       buttonDataOption=":buttonData"
      //       opType="text"
      //     />
      //   );
      // case 'Component': // 预留， 慎用
      //   return gengerateComps(config || {}, res, value, data, props);
      default:
        return res;
    }
  }, value);
};
