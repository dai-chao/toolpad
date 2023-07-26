import React, { useState, useEffect } from 'react'
import { Card, Tooltip, Skeleton } from '@mui/material';
import "../styles/Card.css"
import { createComponent } from '@mui/toolpad/browser';
function Detail(props) {
    const [data, setData] = useState<any>({})
    let { dataKey } = props
    console.log(`${dataKey}`);

    useEffect(() => {
        if (localStorage.getItem(dataKey)) {
            setData(JSON.parse(localStorage.getItem(dataKey) || ''))
        } else {
            setData({})

        }
    }, [props])
    return (
        <div style={{width:"100%"}}>
            {
                Object.keys(data).length > 0 ? <div className='card_wrap'>
                    <div className='card_item' >
                        <img className='card_img' src={data?.imgurl} alt={data?.imgurl} />
                        <Tooltip placement='top' title={data?.title || ''}>
                            <div className='card_title' >{data?.title || ''}</div>
                        </Tooltip>
                        <Tooltip placement='top' title={data?.description || ''}>
                            <div className="card_desc">
                                {data?.description || ''}
                            </div>
                        </Tooltip>
                    </div>
                </div> :
                <h2>暂无数据</h2>
            }
        </div>
    )
}
export default createComponent(Detail, {
    argTypes: {
        dataKey: {
            type: "string",
            default: 'CARD_DETAIL_PARAMS'
        }
    },
});