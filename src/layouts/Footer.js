import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
    <Footer style={{ padding: 0 }}>
        <GlobalFooter
            links={[
                {
                    key: 'github',
                    title: (
                        <p>
                            Copyright <Icon type="github" /> 2018 RichieChoo
                        </p>
                    ),
                    href: 'https://github.com/RichieChoo',
                    blankTarget: true,
                },
            ]}
            copyright={<Fragment />}
        />
    </Footer>
);
export default FooterView;
