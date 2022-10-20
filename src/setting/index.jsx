import React, { useEffect, useState , useCallback } from "react";
import './index.scss';
const Setting = () => {
    let [count, setCount] = useState(1)
    useEffect(()=>{
        console.log('你好呀','设置');
    }, [])
    return (
        <div className="setting">
            我是设置
        </div>
    )
}
export default Setting;