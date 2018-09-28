import { Modal } from 'antd';
import { getData, optionAll } from '../../utils/lang';
import { renderFormat } from './textFormat';

export const dispatchActionIn = (dispatch, dispatchOption = {}, props, initData = {}) => {
  const {
    action,
    data,
    dataOption,
    initDataOption = optionAll,
    patches,
    selfPatch,
    pagePatch,
    router,
    ...options
  } = dispatchOption;

  const calData = Object.assign(
    Array.isArray(data) ? [] : {},
    data,
    getData(initDataOption, initData),
    getData(dataOption, props)
  );
  const option = {
    action,
    ...(options || {}),
    router,
    beforePatches: [
      ...(patches || []),
      {
        path: '#pageData',
        config: pagePatch,
      },
    ],
    data: calData,
  };
  if (typeof selfPatch !== 'undefined') {
    return dispatch.selfBefore(selfPatch)(option);
  }
  return dispatch(option);
};

export const dispatchAction = (dispatch, dispatchOption = {}, props, initData = {}) => {
  if (typeof dispatch !== 'function') {
    return;
  }
  const { confirm, ...options } = dispatchOption;
  if (confirm && confirm.title) {
    Modal.confirm({
      ...confirm,
      title: renderFormat(confirm.title, {}, props),
      content: renderFormat(confirm.content, {}, props),
      onOk() {
        return dispatchActionIn(dispatch, options, props, initData);
      },
      onCancel() {},
    });
  } else {
    return dispatchActionIn(dispatch, options, props, initData);
  }
};
