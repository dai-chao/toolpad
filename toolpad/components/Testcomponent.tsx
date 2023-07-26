import * as React from "react"
import { createComponent } from '@mui/toolpad/browser';
export interface TestComponentProps {
    name: string;
    age: number;
    color:string;
    fontSize:number;
    data:Array<any>;
    sz:object
}
function TestComponent({ name, age ,color,fontSize,data}: TestComponentProps) {
    return <div>
        <div style={{fontSize:fontSize+'px',color:color}}>我的名字是{name || ''}</div>
        <div>我的年龄{age || ''}</div>
        {
            data&&data.map(e=><div key={e}>{e}</div>)
        }
    </div>
}
export default createComponent(TestComponent, {
    argTypes: {
      name: {
        type: 'string',
        default: '123',
      },
      age: {
        type: 'number',
        default: 0,
      },
      color:{
        type:'string',
        default:'#000'
      },
      fontSize:{
        type:'number',
        default:24
      },
      data:{
        type:'array',
        default:[1,2,3]
      },
      sz:{
        type:'object',
        default:{}
      },

    },
  });