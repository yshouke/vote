import { useMount } from 'ahooks';
import { Tabs, Table, Form, Button, Select, Modal, Input, message } from 'antd';
import * as _ from 'lodash';
import { isBoolean } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const { TabPane } = Tabs;


const styleCon: React.CSSProperties={
    textAlign: 'center'

}
const styleCss: React.CSSProperties={
    width: 900,
    display: 'inline-block'
}
const App = () =>{
    const {queryCandidateList, candidateListLoading, queryElectionList, electionList, candidateData, userList, userListLoading, queryUserList, userListPagination} = useModel('useElection')
    const {addNormalUser, loading, userVoting} = useModel('useUserList')
    const [candidateId, setCandidateId] = useState('')
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [form] = Form.useForm();
    const onChange = (key: any) => {
        setCandidateId(key)
        queryUserList({
            id: key,
            pageSize: 10,
            pageNum: 1
        })
      console.log(key);
    };
    const queryToObj = () => {
        let  formattedParams: any = {}

        const params  =  location.href.split("?")[1].split("&");
        
        for ( let i = 0; i < params.length; i ++) {
        
            formattedParams[params[i].split("=")[0]] = params[i].split("=")[1];
        
        }
        return formattedParams
    }
    const userColumns = [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          width: 86
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          key: 'email',
          width: 160
        },
        {
          title: '身份号码',
          dataIndex: 'idCard',
          key: 'idCard',
          width: 150
        }
    ]
    // 投票
    const voting = async (token: string = sessionStorage.getItem('_t') || '') => {
        if (!token) return ;
        console.log(token)
        const res = await userVoting({token, electionId: queryToObj().id, id: form.getFieldsValue()?.candidateElectionId})
        if (isBoolean(res.isVoted)) {
            if (res.isVoted) message.warning(res.msg);
            if (res.isVoted === false ) message.success(res.msg);
            queryCandidateList(queryToObj().id)
        }
        console.log(res)
    }
    const onFinish = (values: any) => {
        console.log('Finish:', values);
        const token = sessionStorage.getItem('_t')
        if (token) {
            voting(token)
        } else {
            showModal()
        }
    };

    const showModal = () => {
      setIsModalVisible(true);
    };
  
    const handleCancel = () => {
      setIsModalVisible(false);
    };

    const onModalFinish = async (values: any) => {
        console.log('Success:', values);
        await addNormalUser(values)
        voting()
        handleCancel()
    };
    
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    useEffect(() => {
        if (!candidateData.length) return;
        const key = candidateId ? candidateId : candidateData[0].id
        setCandidateId(String(key));
        queryUserList({
            id: key,
            pageSize: 10,
            pageNum: 1
        })
        // queryCandidateList(key)
    }, [candidateData])
    useMount(() => {
        const id = queryToObj().id
        if (!id) return alert('给个ID, 大佬')
        queryCandidateList(id)
        queryElectionList({id})
    })
    return (
        <div style={styleCon}>
            <div style={styleCss}>
                <div>
                    <div>标题：{electionList?.[0]?.name}</div>
                    <div>
                        <span style={{marginRight: 11}}>创建时间: {moment(electionList?.[0]?.createdDate).format('YYYY-MM-DD HH:mm:ss')}</span>
                        <span style={{marginRight: 11}}>更新时间：{moment(electionList?.[0]?.updatedDate).format('YYYY-MM-DD HH:mm:ss')}</span>
                        <span>状态： {['未开始', '进行中', '已结束'][electionList?.[0]?.status]}</span>
                    </div>
                    <div>选举投票简介：{electionList?.[0]?.description}</div>
                </div>
                <Tabs activeKey={candidateId} onChange={onChange} type="card">
                    {_.map(candidateData, v=>(
                        <TabPane tab={`${v?.candidate?.username} 总票数: ${v.candidateNumber}`} key={v.id}>
                            <Table rowKey="id" loading={userListLoading} columns={userColumns} dataSource={userList} pagination={{
                                ...userListPagination,
                                onChange: (pageNum,pageSize) => {queryUserList({
                                    id: candidateId,
                                    pageSize,
                                    pageNum
                                })},
                                }}
                            />
                        </TabPane>
                    ))}
                </Tabs>
                <section>
                    <div>
                        <Form form={form} name="horizontal_login" layout="inline" onFinish={onFinish}>
                            <Form.Item
                                label="给："
                                name="candidateElectionId"
                                rules={[{ required: true, message: '请选择候选人' }]}
                            >
                                 <Select
                                    showSearch
                                    placeholder="Select a person"
                                    optionFilterProp="children"
                                    filterOption={(input: string, option: any) =>
                                    (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                      {_.map(candidateData, v=>(
                                            <Select.Option key={v.id} value={v.id}>{v.candidate?.username}</Select.Option>
                                        ))}
                                </Select>
                            </Form.Item>
                      
                            <Form.Item shouldUpdate>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                             
                                >
                                    投票
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </section>
                <Modal title="请先注册登记身份" footer={null} visible={isModalVisible}>
                    <Form
                        name="basic"
                        initialValues={{ remember: true }}
                        onFinish={onModalFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        >
                        <Form.Item
                            label="电子邮箱"
                            name="email"
                            rules={[{ required: true, message: '电子邮箱必填' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="身份号码"
                            name="idCard"
                            rules={[{ required: true, message: '身份号码必填' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button loading={loading} type="primary" htmlType="submit">
                            提交
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
} 
export default App;