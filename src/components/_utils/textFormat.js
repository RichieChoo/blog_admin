import React from 'react';
import { Divider } from 'antd';

import { getData, generateArr } from '../../utils/lang';

export const renderFormat = (text = '', wordStyle = {}, props) =>
  text.split('\n').map(
    (p, index) =>
      (p === '*' ? (
        <Divider key={generateArr(index, '*').join('')} />
      ) : (
        <p key={p}>
          {p.split('{').map(s =>
            s.split('}').map(
              (v, i, arr) =>
                (i === arr.length - 1 ? (
                  v
                ) : (
                  <span key={v} style={wordStyle}>
                    {getData(v, props)}
                  </span>
                ))
            )
          )}
        </p>
      ))
  );
