
import React, { useState, PureComponent, useEffect } from 'react';
import { Card, Tooltip, Skeleton, TextField } from '@mui/material';
import { Space, Button, Empty, Form, Input, Modal, message, Spin, BackTop, Breadcrumb } from 'antd'
import { FormOutlined } from '@ant-design/icons';
import { createComponent } from '@mui/toolpad/browser';
import { getTableList, getData, addDataToList, updateDataToList } from '../services/card'
import qs from 'qs';
import "../styles/Card.css"
let tableList = [], tableListSelect = [], bindList = [];

export interface CardItem {
    id?: number;
    title: string;
    description: string;
    imgurl: string;
}
export interface CardProps {
    rows: CardItem[];
    style: 'card' | 'list';
    loading: boolean;
    onClick: React.MouseEventHandler<HTMLDivElement>;
    search: boolean;
    add: boolean;
    selectDataList: string;
    image: string;
    title: string;
    description: string;
    isEdit: boolean;
    isDetail: boolean
}
function CardView({ rows = [], style, loading, search, add, selectDataList, image, title, description, isEdit, isDetail }: CardProps) {
    const [form] = Form.useForm();
    const [pageLoading, setPageLoading] = useState(false)
    const [editdata, setEditData] = useState({}) //编辑的数据
    const [detailData, setDetailData] = useState({}) //详情数据
    const [detailFlag, setDetailFlag] = useState(false) //控制详情展示隐藏
    const [modaleTitle, setModaleTitle] = useState('') // 新增编辑弹窗的标题
    const [addSpin, setAddSpin] = useState(false) // 新增的loading
    const [keyWords, setKeyWords] = useState('') // 搜索关键字
    const [rowData, setRowData] = useState(JSON.parse(JSON.stringify(rows))) //数据源
    const [rowNewData, setRowNewData] = useState(JSON.parse(JSON.stringify(rows)))//数据源
    const [addModuleFlag, setAddModuleFlag] = useState(false)//控制新增编辑弹窗
    const [column, setColumn] = useState([]) //表数据
    const [imageKey, setImageKey] = useState('img') //图片字段名
    const [titleKey, setTitleKey] = useState('title') //标题字段名
    const [descriptionKey, setDescriptionKey] = useState('desc') //描述字段名

    /**
     * 请求下拉列表
    */
    useEffect(() => {
        getTableList(qs.stringify({
            userid: 'qh0279qr',
            company_id: 'ag3407',
            project_id: 'ZEPJTU1685089612762279797',
            token: 'a1f7eea876bf4f6197323b12c37adfb8',
            uid: 'qh0279qr'
        })).then(res => {
            tableList = Array.from(new Set(res?.data?.Data?.rows))
            tableList.map((item: any) => {
                tableListSelect.push(item?.title)
            })
            tableListSelect = Array.from(new Set(tableListSelect))
            getList()
        })
    }, [])

    /**
     * 图片字段名发生变化
    */
    useEffect(() => {
        let list: any = column.filter((item: any) => item.column_label === image)
        setImageKey(list[0]?.column_id)
    })
    /**
     * 标题字段名发生变化
    */
    useEffect(() => {
        let list: any = column.filter((item: any) => item.column_label === title)
        setTitleKey(list[0]?.column_id)
    })
    /**
     * 描述字段名发生变化
    */
    useEffect(() => {
        let list: any = column.filter((item: any) => item.column_label === description)
        setDescriptionKey(list[0]?.column_id)
    })
    /**
     * 请求列表数据
    */
    const getList = () => {
        setPageLoading(true)
        if (selectDataList) {
            let list: any = tableList.filter((item: any) => item?.title === selectDataList)
            // console.log(list);
            getData({
                "user_id": "qh0279qr",
                "company_id": "ag3407",
                "group_id": "FVQNRD1685089612743025055",
                "project_id": "ZEPJTU1685089612762279797",
                "table_id": list[0]?.table_id,
                "conditions": [],
                "sort": "",
                "page_size": 500,
                "page": 0,
            }).then(res => {
                let { column, rows } = res?.data?.Data
                setRowData([...rows?.rows])
                setRowNewData([...rows?.rows])
                setColumn(column)
                column.map((item: any) => {
                    bindList.push(item.column_label)
                })
            }).catch(err=>{})
            .finally(()=>{setPageLoading(false)})
        }
    }
    /**
     * 表数据变化请求数据
    */
    useEffect(() => {
        getList()
    }, [selectDataList])

    // 判断是否是预览页面
    // useEffect(() => {
    //     const isPreview = process.env.NODE_ENV !== 'production';
    //     const isRenderedInCanvas =
    //         typeof window === 'undefined'
    //             ? false
    //             : !!(window.frameElement as HTMLIFrameElement)?.dataset?.toolpadCanvas;
    //     const showOperate = isPreview && !isRenderedInCanvas;
    //     setIsEdit(!showOperate)
    // }, [])

    /**
     * 控制详情展示
    */
    const toDetail = (e: any) => {
        if (!isDetail) return
        setDetailData(e)
        setDetailFlag(true)
        // localStorage.setItem('CARD_DETAIL_PARAMS', JSON.stringify(e))
        // onClick()
    }
    /**
     * 存储搜索关键字
    */
    const inputChange = (e: any) => {
        setKeyWords(e.target.value)
    }
    /**
     * 发起搜索
    */
    const query = () => {
        if (keyWords) {
            let data = rowNewData.filter((i: any) => i[titleKey] == keyWords)
            setRowData(data)
        } else {
            setRowData(rowNewData)
        }
    }

    /**
     * 插入数据
    */
    const addData = () => {
        setModaleTitle('新增数据')
        setAddModuleFlag(true)
        setEditData({})
        form.resetFields()
    }

    /**
     * 提交数据到后台
    */
    const onFinish = (values: any) => {
        setAddSpin(true)
        const { img, title, desc } = values
        let list: any = tableList.filter((item: any) => item?.title === selectDataList)
        let params = {
            "user_id": "qh0279qr",
            "company_id": "ag3407",
            "group_id": "FVQNRD1685089612743025055",
            "project_id": "ZEPJTU1685089612762279797",
            column: {
                [imageKey]: img,
                [titleKey]: title,
                [descriptionKey]: desc,
            },
            table_id: list[0].table_id,
            table_name: list[0].table_name,
        }
        // console.log(params);
        if (Object.keys(editdata).length === 0) {
            addDataToList(params).then(res => {
                let { Code, Msg } = res.data
                if (Code !== 2000) {
                    message.error(Msg)
                } else {
                    message.success(Msg)
                    getList()
                    setAddModuleFlag(false)
                }
            }).catch(err => {
            }).finally(() => {
                setAddSpin(false)
            })
        } else {
            updateDataToList({
                ...params,
                column: [{
                    ...editdata,
                    ...params.column
                }]
            }).then(res => {
                // console.log(res);
                let { Code, Msg } = res.data
                if (Code !== 2000) {
                    message.error(Msg)
                } else {
                    message.success(Msg)
                    getList()
                    setAddModuleFlag(false)
                }
            }).catch(err => {
            }).finally(() => {
                setAddSpin(false)
            })
        }

    };
    /**
     * 编辑 打开弹窗写入数据
    */
    const edit = (data: any) => {
        setModaleTitle("编辑数据")
        setAddModuleFlag(true)
        setEditData(data)
        form.setFieldsValue({
            img: data[imageKey],
            title: data[titleKey],
            desc: data[descriptionKey],
        })
    }
    /**
     * 按照不同 style 创建 DOM 
    */
    const DOM = style === 'card' ?
        <div className='card_wrap'>
            {
                rowData.map((item: any, index: number) => {
                    return (
                        <div key={'card_item' + index} className='card_item' onClick={() => toDetail(item)} >
                            {
                                isEdit && <FormOutlined className='edit_icon' onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    edit(item)
                                }} />
                            }
                            <img className='card_img' src={item[imageKey] || ''} alt={item[imageKey] || ''} />
                            <Tooltip placement='top' title={item[titleKey] || ''}>
                                <div className='card_title' >{item[titleKey] || ''}</div>
                            </Tooltip>
                            <Tooltip placement='top' title={item[descriptionKey] || ''}>
                                <div className="card_desc">
                                    {item[descriptionKey] || ''}
                                </div>
                            </Tooltip>
                        </div>
                    )
                })
            }
        </div> :
        <div className='list_wrap'>
            {
                rowData.map((item: any, index: number) => {
                    return (
                        <div key={'list_item' + index} className='list_item'>
                            {
                                isEdit && <FormOutlined className='edit_icon' onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    edit(item)
                                }} />
                            }
                            <img className='list_img' src={item[imageKey] || ''} alt={item[imageKey]} />
                            <div className='list_content'>
                                <Tooltip placement='top' title={item[titleKey] || ''}>
                                    <div className=' list_title' >{item[titleKey] || ''}</div>
                                </Tooltip>
                                <Tooltip placement='top' title={item[descriptionKey] || ''}>
                                    <div className=" list_desc">
                                        {item[descriptionKey] || ''}
                                    </div>
                                </Tooltip>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    
    /**
     * 根据不同style创建骨架屏 
    */
    const SKELETON = style === 'list' ? (
        <div>
            {
                [1, 2, 3, 4].map(_ => <div key={_} style={{ display: 'flex', marginBottom: "10px" }}>
                    <Skeleton variant="circular" width="80px" height="80px" style={{ marginRight: "10px" }} />
                    <Skeleton variant="rectangular" width="100%" height={80} />
                </div>)
            }
        </div>
    ) : (
        <div style={{ display: "flex" }}>
            {
                [1, 2, 3, 4].map(_ => <div key={_} style={{ width: "25%", height: "360px", border: "5px solid #fff" }}>
                    <Skeleton variant="rectangular" width="100%" height="60%" />
                    <Skeleton variant="rectangular" width="100%" height="10%" style={{ marginBottom: "10px", marginTop: "10px" }} />
                    <Skeleton variant="rectangular" width="100%" height="20%" />
                </div>)
            }
        </div>
    )
    return <div className='wrap'>
        {
            ((search || add) && !detailFlag) && <div className='operate_wrap'>
                <div className='operate'>
                    {
                        add && <Button type='primary' onClick={addData}>新增数据</Button>
                    }
                    {
                        search && <div className='search_wrap'>
                            <TextField value={keyWords} size='small' id="outlined-basic" label="关键字搜索" variant="outlined" onChange={inputChange} />
                            <Button type='primary' onClick={query} >搜索</Button>
                        </div>
                    }
                </div>
            </div>
        }
        {
            detailFlag && <div className='detail_wrap'>
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>
                        <a onClick={() => {
                            setDetailFlag(false)
                            setDetailData({})
                        }}>Card</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Detail
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div className='wrap'>
                    <div className='card_wrap'>
                        <div className='card_item'  >
                            <img className='card_img' src={detailData[imageKey] || ''} alt={detailData[imageKey] || ''} />
                            <Tooltip placement='top' title={detailData[titleKey] || ''}>
                                <div className='card_title' >{detailData[titleKey] || ''}</div>
                            </Tooltip>
                            <Tooltip placement='top' title={detailData[descriptionKey] || ''}>
                                <div className="card_desc">
                                    {detailData[descriptionKey] || ''}
                                </div>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </div>
        }
        {
            Array.isArray(rowData) && rowData.length > 0 && !detailFlag ? (pageLoading ? SKELETON : DOM) : (detailFlag ? null : <Empty />)
        }
        <BackTop>
            <div style={{
                height: 40,
                width: 40,
                lineHeight: '40px',
                borderRadius: 4,
                backgroundColor: '#1088e9',
                color: '#fff',
                textAlign: 'center',
                fontSize: 14,
            }}>UP</div>
        </BackTop>
        <Modal
            width={600}
            footer={null}
            title={modaleTitle}
            open={addModuleFlag}
            onCancel={() => setAddModuleFlag(false)}>
            <Spin spinning={addSpin}>
                <div className='add_wrap'>
                    <div className='add_content'>
                        <div className='form_content'>
                            <Form
                                form={form}
                                name="basic"
                                labelCol={{ span: 5 }}
                                wrapperCol={{ span: 18 }}
                                initialValues={{ remember: true }}
                                onFinish={onFinish}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="Image"
                                    name="img"
                                    rules={[{ required: true, message: 'Please input!' }]}
                                >
                                    <Input placeholder='Please input!' />
                                </Form.Item>
                                <Form.Item
                                    label="Title"
                                    name="title"
                                    rules={[{ required: true, message: 'Please input!' }]}
                                >
                                    <Input placeholder='Please input!' />
                                </Form.Item>
                                <Form.Item
                                    label="Description"
                                    name="desc"
                                    rules={[{ required: true, message: 'Please input!' }]}
                                >
                                    <Input placeholder='Please input!' />
                                </Form.Item>

                                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                    <Space>
                                        <Button onClick={() => setAddModuleFlag(false)} >取消</Button>
                                        <Button type='primary' htmlType="submit" >确定</Button>
                                    </Space>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            </Spin>
        </Modal>
    </div>;
}
export default createComponent(CardView, {
    argTypes: {
        selectDataList: {
            type: 'string',
            enum: tableListSelect,
        },
        image: {
            type: 'string',
            enum: bindList,
        },
        title: {
            type: 'string',
            enum: bindList,
        },
        description: {
            type: 'string',
            enum: bindList,
        },
        style: {
            type: 'string',
            enum: ['card', 'list'],
            default: 'card',
        },
        // loading: {
        //     type: 'boolean',
        //     default: false
        // },
        search: {
            type: 'boolean',
            default: false
        },
        add: {
            type: 'boolean',
            default: false
        },
        isEdit: {
            type: 'boolean',
            default: false
        },
        isDetail: {
            type: 'boolean',
            default: false
        },
    },
});


// [
//     {
//         title: 'Card title',
//         description:'This is the description',
//         imgurl:'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
//     },
//     {
//         title: 'Card title',
//         description:'This is the description',
//         imgurl:'https://cdn4.buysellads.net/uu/1/137472/1687189225-platform.sh-2023new-260x200.png',
//     },
//     {
//         title: 'Card title',
//         description:'This is the description',
//         imgurl:'https://mui.com/static/images/cards/live-from-space.jpg',
//     },
//     {
//         title: 'Card title',
//         description:'This is the description',
//         imgurl:'https://mui.com/static/images/cards/contemplative-reptile.jpg',
//     },
//     {
//         title: 'Card title',
//         description:'This is the description',
//         imgurl:'https://mui.com/static/images/cards/paella.jpg',
//     }
// ]