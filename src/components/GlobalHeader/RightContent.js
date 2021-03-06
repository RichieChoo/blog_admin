import React, { PureComponent } from 'react';
import { FormattedMessage, formatMessage, setLocale, getLocale } from 'umi/locale';
import { Spin, Tag, Menu, Icon, Dropdown, Avatar, Button } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
// import NoticeIcon from '../NoticeIcon';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';

export default class GlobalHeaderRight extends PureComponent {
    getNoticeData() {
        const { notices = [] } = this.props;
        if (notices.length === 0) {
            return {};
        }
        const newNotices = notices.map(notice => {
            const newNotice = { ...notice };
            if (newNotice.datetime) {
                newNotice.datetime = moment(notice.datetime).fromNow();
            }
            if (newNotice.id) {
                newNotice.key = newNotice.id;
            }
            if (newNotice.extra && newNotice.status) {
                const color = {
                    todo: '',
                    processing: 'blue',
                    urgent: 'red',
                    doing: 'gold',
                }[newNotice.status];
                newNotice.extra = (
                    <Tag color={color} style={{ marginRight: 0 }}>
                        {newNotice.extra}
                    </Tag>
                );
            }
            return newNotice;
        });
        return groupBy(newNotices, 'type');
    }

    changLang = () => {
        const locale = getLocale();
        if (!locale || locale === 'zh-CN') {
            setLocale('en-US');
        } else {
            setLocale('zh-CN');
        }
    };

    render() {
        const { currentUser, onMenuClick, theme } = this.props;
        const menu = (
            <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
                <Menu.Item key="userCenter">
                    <Icon type="user" />
                    <FormattedMessage id="menu.account.center" defaultMessage="account center" />
                </Menu.Item>
                <Menu.Item key="logout">
                    <Icon type="logout" />
                    <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
                </Menu.Item>
            </Menu>
        );
        let className = styles.right;
        if (theme === 'dark') {
            className = `${styles.right}  ${styles.dark}`;
        }
        return (
            <div className={className}>
                <HeaderSearch
                    className={`${styles.action} ${styles.search}`}
                    placeholder={formatMessage({ id: 'component.globalHeader.search' })}
                    dataSource={[
                        formatMessage({ id: 'component.globalHeader.search.example1' }),
                        formatMessage({ id: 'component.globalHeader.search.example2' }),
                        formatMessage({ id: 'component.globalHeader.search.example3' }),
                    ]}
                    onSearch={value => {
                        console.log('input', value); // eslint-disable-line
                    }}
                    onPressEnter={value => {
                        console.log('enter', value); // eslint-disable-line
                    }}
                />
                {currentUser.name ? (
                    <Dropdown overlay={menu}>
                        <span className={`${styles.action} ${styles.account}`}>
                            <Avatar
                                size="small"
                                className={styles.avatar}
                                src={currentUser.avatar}
                                alt="avatar"
                            />
                            <span className={styles.name}>{currentUser.name}</span>
                        </span>
                    </Dropdown>
                ) : (
                    <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
                )}
                <Button
                    size="small"
                    ghost={theme === 'dark'}
                    style={{
                        margin: '0 8px',
                    }}
                    onClick={() => {
                        this.changLang();
                    }}
                >
                    <FormattedMessage id="navbar.lang" />
                </Button>
            </div>
        );
    }
}
