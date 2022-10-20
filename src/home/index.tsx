import React, { useEffect, useState , useCallback } from "react";
import Setting from "../setting";
import './index.scss';
const Home = () => {
    let [count, setCount] = useState(1)
    useEffect(()=>{
        console.log('你好呀','首页');
    }, [])
    return (
        <div className="home">
            <Setting/>
        </div>
    )
}
export default Home;