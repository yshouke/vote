import { useState } from 'react';
import { post } from '@/services/http';
import { useSetState } from 'ahooks';
import { message } from 'antd';
import React from 'react';
import {
    AppstoreOutlined,
  } from '@ant-design/icons';
import { history } from 'umi';
import { find } from 'rxjs';
import { filter, groupBy } from 'lodash';
type menuItem = {
    username?: string,
    password?: string
}
enum MENUS {
    ADD = '/menus/addMenu', // 添加菜单接口
    FIND_ALL = '/menus/findAllMenu', // 查找所有菜单接口
    DEL = '/menus/deleteById', // 根据id删除菜单
    EDIT = '/menus/editById' // 根据id编辑菜单
}
const formatMenu = (v: any) => {
    return ({
        key: v.id,
        icon: React.createElement(AppstoreOutlined),
        label: v.menuName,
        _data: v,
        onClick: () => {
            if (v.type === 'catalogue') return;
            if (v.route) {
                history.push(v.route)
            } else {
                message.error('请先配置路由地址')
            }
        }
    })
}
export default function useMenus(params: menuItem) {
    const [loading, setLoading] = useState(false)
    const [state, setState] = useSetState<any>({
        menuList: [],
        catalogueList: [],
        directoryTree:[],
        initialDataMap: []
      });
    const addMenu = (info: menuItem) =>{
        setLoading(true)
        return post(MENUS.ADD, info).then(v =>{
            findAllMenu()
            return v;
        }).finally(() => {
            setLoading(false)
        })
    }
    const findAllMenu = () =>{
        setLoading(true)
        return post(MENUS.FIND_ALL).then((data) =>{
            console.log(data)
            setState({
                catalogueList: filter(data, ['type', 'catalogue']),
                initialDataMap: groupBy(data, 'id')
            })
            return data;
        })
        .finally(() => {
            console.log('查询菜单结束')
            setLoading(false)
        })
    }
    const getMenuById = (id: number) => {
        return state.initialDataMap[id][0] || {}
    }
    const delMenu = async (data: any) => {
        setLoading(true)
        await post(MENUS.DEL, data)
        findAllMenu()
    }
    const editMenu = async (data: any) => {
        setLoading(true)
        await post(MENUS.EDIT, data)
        findAllMenu()
    }

    return {
        // user,
        ...state,
        loading,
        findAllMenu,
        addMenu,
        delMenu,
        editMenu,
        getMenuById
    };
}