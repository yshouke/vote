import { useState } from 'react';
import { post } from '@/services/http';

type loginInfo = {
    username: string,
    password: string
}
export default function loadUserInfo(params: loginInfo) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)

    const loginUser = (info: loginInfo) =>{
        setLoading(true)
        return post('/user/login', info).then(v =>{
            console.log(v)
            setUser(v)
            sessionStorage.setItem('user', JSON.stringify(v||{}))
            if (v?.statusCode && v?.statusCode !== 200) return false
            return v;
        }).finally(() => {
            setLoading(false)
        })
    }
    return {
        user,
        loading,
        loginUser,
    };
}