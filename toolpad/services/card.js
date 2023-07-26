
import axios from 'axios';

// 获取所有表列表
export const getTableList = (params) => {
    return axios.get(`https://api3.windeal.cn/v1/api/datatable/project/table/list?${params}`)
}
//根据表获取数据
export const getData = (params) => {
    return axios.post(`https://api3.windeal.cn/v1/api/datatable/table/row/list?token=6e4fe20d3722ef6eb17969c02c1b6e8f&company_id=ag3407&uid=qh0279qr`,params)
}
//插入数据
export const addDataToList = (params)=>{
    return axios.post('https://api3.windeal.cn/v1/api/datatable/table/row/add?token=6e4fe20d3722ef6eb17969c02c1b6e8f&company_id=ag3407&uid=qh0279qr',params)
}
// 更新数据
export const updateDataToList = (params)=>{
    return axios.post('https://api3.windeal.cn/v1/api/datatable/table/row/update?token=6e4fe20d3722ef6eb17969c02c1b6e8f&company_id=ag3407&uid=qh0279qr',params)
}

