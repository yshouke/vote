import { useState } from 'react';
import { del, get, post, put } from '@/services/http';
import { useSetState } from 'ahooks';

type loginInfo = {
    username: string,
    password: string,
    pageSize?: number,
    pageNum?: number
}
enum ROLES_API {
    ROLE_LIST = 'candidate',
    ROLE_ADD = 'candidate',
    ROLE_UPDATE = 'candidate/updateRoles',
    ROLE_DEL = 'candidate'
}
export default function useCandidate(params: loginInfo) {
    const [loading, setLoading] = useState(false)
    const [visible, setVisible] = useState(false)
    const [state, setState] = useSetState({
        candidateList: []
    })
    const findCandidate = (info={}, cb=(data:any)=>{}) =>{
        setLoading(true)
        return get(ROLES_API.ROLE_LIST, {
            ...info
        }).then((data) =>{
            setState({
                candidateList: data || [],
            })
            cb && cb(data)
        }).finally(() => {
            setLoading(false)
        })
    }
    /**
     * 
     * @param opt 用户的信息
     * @param isFindUsers 是否调查询用户接口
     * @returns 
     */
    const addCandidate = (opt:any, isFindUsers=false, findCB=(data?:any) => {}) => {
        setLoading(true)
        return post(ROLES_API.ROLE_ADD, opt).then(res =>{
            isFindUsers && findCandidate({}, findCB) || setLoading(false)
            return res
        })
    }

    const updateRoles = (opt:any, isFindUsers?: boolean) => {
        setLoading(true)
        return put(ROLES_API.ROLE_UPDATE, opt).then(res =>{
            isFindUsers && findCandidate() || setLoading(false)
            return res
        })
    }
    const delCandidate = (opt:any, isFindUsers?: boolean) => {
        setLoading(true)
        return del(ROLES_API.ROLE_DEL, opt).then(res =>{
            isFindUsers && findCandidate() || setLoading(false)
            return res
        })
    }
    return {
        candidateList: state.candidateList,
        loading,
        visible,
        findCandidate,
        addCandidate,
        updateRoles,
        delCandidate,
        showDrawer: (bol: boolean) => setVisible(bol)
    };
}