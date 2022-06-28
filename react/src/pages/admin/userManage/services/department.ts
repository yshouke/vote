import {
    AppstoreOutlined,
    BarChartOutlined,
    CloudOutlined,
    ShopOutlined,
    TeamOutlined,
    UserOutlined,
    UploadOutlined,
    VideoCameraOutlined,
  } from '@ant-design/icons';

import React from 'react';
import { message } from 'antd';
import { history } from 'umi';
console.log(AppstoreOutlined)
const formatMenu = (v: any) => {
    return ({
        key: v.id,
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
const formatDirectoryTree = (v: any) => {
    return ({
        key: v.id,
        label: v.menuName,
        _data: v,
    })
}

export const setMenuListData = (data: any) => {
    return data.filter((v: any) => !v.parent && v.isShow).map((v: any) => {
        if (v?.child?.length) {
            return {
                key: v.id,
                label: v.menuName,
                _data: v,
                children: v.child.map((val: any) => formatMenu(val))
            }
        } else {
            return formatMenu(v)
        }
    })
}


// export const setDirectoryTreeData = (data: any) => {
//     return data.filter((v: any) => !v.parent).map((v: any) => {
//         if (v?.child?.length) {
//             return {
//                 key: v.id,
//                 label: v.menuName,
//                 _data: v,
//                 children: v.child.map((val: any) => formatDirectoryTree(val))
//             }
//         } else {
//             return formatDirectoryTree(v)
//         }
//     })
// }