/**
 * Created by Richie on 2018/4/11
 */
import React, {PureComponent} from 'react';
import {Button, message} from 'antd';


const xss = require('xss');
const EEditor = require('src/components/ARComponents/WangEidtor/index');
const editor = new EEditor('#editor1', '#editor2');

class WangEditor extends PureComponent {
    state = {
        data: '',
        length: 0,
    };

    componentDidMount() {
        let list = [
            'head',  // 标题
            'bold',  // 粗体
            'fontSize',  // 字号
            'fontName',  // 字体
            'italic',  // 斜体
            'underline',  // 下划线
            'strikeThrough',  // 删除线
            'foreColor',  // 文字颜色
            'backColor',  // 背景颜色
            'link',  // 插入链接
            'list',  // 列表
            'justify',  // 对齐方式
            'quote',  // 引用
            'emoticon',  // 表情
            'image',  // 插入图片
            'table',  // 表格
            'undo',  // 撤销
            'redo'  // 重复
        ];
        let noPictureList = [
            'head',  // 标题
            'bold',  // 粗体
            'fontSize',  // 字号
            'fontName',  // 字体
            'italic',  // 斜体
            'underline',  // 下划线
            'strikeThrough',  // 删除线
            'foreColor',  // 文字颜色
            'backColor',  // 背景颜色
            'link',  // 插入链接
            'list',  // 列表
            'justify',  // 对齐方式
            'table',  // 表格
            'undo',  // 撤销
            'redo'  // 重复
        ];
        const {
            uploadImg: {
                url, header, fileName = "photo", link = false, callback = () => {}
            }, debug, data = ""
        } = this.props;
        const paramsList = this.props.noPicture ? noPictureList : list;

        if (uploadImg) {
            editor.customConfig.menus = this.props.disableToolBar ? [] : paramsList;
            //上传图片
            editor.customConfig.uploadImgServer = url;
            // editor.customConfig.uploadImgShowBase64 = true;
            editor.customConfig.uploadImgHeaders = header;
            editor.customConfig.showLinkImg = link;

            //如果跨域传cookie
            // editor.customConfig.withCredentials = true;
            editor.customConfig.uploadFileName = fileName;
            editor.customConfig.uploadImgHooks = {
                before: function (xhr, editor, files) {

                },
                success: function (xhr, editor, result) {
                    // 图片上传并返回结果，图片插入成功之后触发
                    callback();
                    message.success('图片上传成功')
                },
                fail: function (xhr, editor, result) {
                    // 图片上传并返回结果，但图片插入错误时触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
                    console.warn('插入错误', result)
                },
                error: function (xhr, editor) {
                    // 图片上传出错时触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
                    message.error('上传文件错误')
                },
                timeout: function (xhr, editor) {
                    message.warn('上传文件超时')
                },

                customInsert: function (insertImg, result, editor) {
                    if (!!result.data) {
                        let imgArr = result.data.split(',');
                        imgArr.forEach((v) => {
                            insertImg(v);
                        });
                    }
                }
            }
        }

        if (debug) {
            //debug mode
            editor.customConfig.debug = true;
        }

        //限制输入
        editor.customConfig.onchange = this.handleOnChange;
        editor.customConfig.onchangeTimeout = 500;
        editor.customConfig.uploadImgMaxLength = 5;
        editor.customConfig.zIndex = 1;

        editor.create();

        editor.txt.html(data);
    }


    componentWillUpdate(nextProps, nextState) {
        if (this.props.data !== nextProps.data) {
            editor.txt.html(nextProps.data);
        }
    }

    handleOnChange = (html) => {
        const { onChange=()=>{} }=this.props;
        onChange(xss(html));
        this.setState({
            length: editor.txt.text().length
        },()=>{
            message.destroy();
            message.success('已保存');
        });

    };


    render() {

        const {borderWidth = 1, borderColor = "#CCC", width="100%", height="100%", adaptive=true} = this.props;
        const {length}=this.state;
        const border = `${borderWidth}px solid ${borderColor}`;
        const styleBody = adaptive ? {border, width, height, borderTop: 0} : {
            border,
            "minWidth": width,
            height,
            borderTop: 0
        };
        return (
            <div>
                <p>总计{length}字</p>
                <div id="editor1" style={{border, width}}/>
                <div id="editor2" style={styleBody}/>
                <br/>
                <Button type="primary" onClick={this.handleOnChange}>保存</Button>
            </div>
        )
    }
}

export default WangEditor;
