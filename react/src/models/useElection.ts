import { useState } from 'react';
import { get, post, del, put } from '@/services/http';
import { useSetState } from 'ahooks';
import { message } from 'antd';
import React from 'react';
import {
    AppstoreOutlined,
  } from '@ant-design/icons';
import { history } from 'umi';
import { find } from 'rxjs';
import { filter, groupBy, isNil, omitBy } from 'lodash';
type menuItem = {
    username?: string,
    password?: string
}
enum ELECTION {
    ADD = '/election', // 添加选举接口
    FIND_ALL = '/election/queryElectionList',
    DEL = '/election', // 根据id删除
    EDIT = '/election', // 根据id编辑
    CANDIDATE = '/election/queryCandidateAndNumber',
    VOTING_USER = '/election/queryVotingUserList',
}

export default function useElection(params: menuItem) {
    const [loading, setLoading] = useState(false)

    const [state, setState] = useSetState<any>({
        electionList: [],
        directoryTree:[],
        initialDataMap: [],
        candidateData: [],
        candidateListLoading: false,
        pagination: {
            pageSize: 10,
            total: 0,
            current: 1
        },
        userList: [],
        userListLoading: false,
        userListPagination: {
            pageSize: 10,
            total: 0,
            current: 1
        }
      });
    const addElection = (info: menuItem) =>{
        setLoading(true)
        return post(ELECTION.ADD, info).then(v =>{
            queryElectionList()
            return v;
        }).finally(() => {
            setLoading(false)
        })
    }
    const queryUserList = (opt:any) =>{
        setState({userListLoading: true})
        return post(ELECTION.VOTING_USER, opt).then((data) =>{
            const {list, pageSize, pageNum, count} = data;
            setState({
                userList: list,
                userListPagination: {
                    pageSize,
                    total: count,
                    current: pageNum
                },
            })
        }).finally(() => {
            setState({userListLoading: false})
        })
    }
    const queryCandidateList = (id:number) =>{
        setState({candidateListLoading: true})
        return get(ELECTION.CANDIDATE, {id}).then((data) =>{
            setState({
                candidateData: data,
            })
        }).finally(() => {
            setState({candidateListLoading: false})
        })
    }

    const queryElectionList = (info: any={}) =>{
        setLoading(true)
        return post(ELECTION.FIND_ALL, {
            ...FilterNullValues(info),
            pageSize: info?.pageSize || 10,
            pageNum: info?.pageNum || 1
        }).then((data) =>{
            const {list, pageSize, pageNum, count} = data;
            setState({
                electionList: list,
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

    const FilterNullValues = (data: any) => {
        return omitBy(data, (v) => isNil(v) || v === '' );
    }
    const deleteVoting = async (data: any) => {
        setLoading(true)
        await del(ELECTION.DEL, data)
        queryElectionList()
    }
    const changeVotingStatus = async (data: any) => {
        setLoading(true)
        await put(ELECTION.EDIT, {...data, resultUrl: `${location.origin}/voting?id=${data.id}`})
        queryElectionList()
    }


    return {
        // user,
        ...state,
        loading,
        queryElectionList,
        addElection,
        deleteVoting,
        changeVotingStatus,
        queryCandidateList,
        queryUserList
    };
}