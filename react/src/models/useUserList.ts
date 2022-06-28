import { useState } from 'react';
import { post, put } from '@/services/http';
import { useSetState } from 'ahooks';
import { identity, isNil, isString, omitBy, pickBy } from 'lodash';
import { async } from 'rxjs';

type loginInfo = {
    username: string,
    password: string,
    pageSize?: number,
    pageNum?: number
}
enum USER_API {
    USER_LIST = 'user/findUsers',
    USER_ADD = 'user/insertUsers',
    USER_UPDATE = 'user/updateUsers',
    USER_DEL = 'user/delUsers',
    ADD_NORMAL_USER = '/user/addNormalUser',
    USER_VOTING = '/election/userVoting'
}
export default function userInfoManage(params: loginInfo) {
    const [loading, setLoading] = useState(false)
    const [visible, setVisible] = useState(false)
    const [state, setState] = useSetState({
        pagination:{
            total: 0,
            current: 1,
            pageSize: 10
        },
        userList: []
    })
    const findUsers = (info?: loginInfo) =>{
        setLoading(true)
        return post(USER_API.USER_LIST, {
            ...FilterNullValues(info),
            pageSize: info?.pageSize || 10,
            pageNum: info?.pageNum || 1
        }).then((data) =>{
            const {list, pageSize, pageNum, count} = data;
            setState({
                userList: list,
                pagination: {
                    pageSize,
                    total: count,
                    current: pageNum
                },
            })
        }).finally(() => {
            setLoading(false)
        })
    }
    const FilterNullValues = (data) => {
        return omitBy(data, (v) => isNil(v) || v === '' );
    }
    /**
     * 
     * @param opt 用户的信息
     * @param isFindUsers 是否调查询用户接口
     * @returns 
     */
    const addUser = (opt:any, isFindUsers=false) => {
        setLoading(true)
        return post(USER_API.USER_ADD, opt).then(res =>{
            isFindUsers && findUsers() || setLoading(false)
            return res
        })
    }
    const addNormalUser = async (opt:any) => {
        setLoading(true)
        return post(USER_API.ADD_NORMAL_USER, opt).then(data =>{
            setLoading(false)
            if (isString(data)) {
                sessionStorage.setItem('_t', data)
            }
            return data
        })
    }
    const userVoting = (opt) => {
        return put(USER_API.USER_VOTING, opt).then(data => {
            return data
        })
    }
    const updateUser = (opt:any, isFindUsers?: boolean) => {
        setLoading(true)
        return post(USER_API.USER_UPDATE, opt).then(res =>{
            isFindUsers && findUsers() || setLoading(false)
            return res
        })
    }
    const delUsers = (opt:any, isFindUsers?: boolean) => {
        setLoading(true)
        return post(USER_API.USER_DEL, opt).then(res =>{
            isFindUsers && findUsers() || setLoading(false)
            return res
        })
    }
    return {
        findUsers,
        pagination: state.pagination,
        userList: state.userList,
        loading,
        visible,
        addUser,
        updateUser,
        delUsers,
        showDrawer: (bol: boolean) => setVisible(bol),
        addNormalUser,
        userVoting
    };
}