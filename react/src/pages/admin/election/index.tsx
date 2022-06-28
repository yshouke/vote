import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { useMount } from 'ahooks';
import { Divider, Input, Select, Form, Popconfirm, Typography, Button, Menu, Modal, Space, Table, Tag, Drawer } from 'antd';
import moment from 'moment';
import { SetStateAction, useEffect, useState } from 'react';
import { useModel } from 'umi';
const { Option } = Select;
const statusArr = ['未开始', '进行中', '已结束']
const App = () => {
  const {userList, addElection, changeVotingStatus, deleteVoting, userListLoading, queryUserList, userListPagination, queryElectionList, candidateListLoading, candidateData, queryCandidateList, pagination, electionList, loading } = useModel('useElection')
  const [visible, setVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const [statusVisible, setStatusVisible] = useState(false);
  const [statusVal, setStatusVal] = useState<string>('');
  const [candidateId, setCandidateId] = useState('')
  const [items, setItems] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [statusId, setStatusId] = useState('');
  const [childrenDrawer, setChildrenDrawer] = useState(false);
  const [ModalForm] = Form.useForm();
  const [form] = Form.useForm();
  const { findCandidate, candidateList, addCandidate } = useModel('useCandidate')

  const candidateColumns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '候选人',
      dataIndex: 'candidate.username',
      key: 'candidate.username',
      render: (_: any, rec: any) => (rec.candidate.username)
    },
    {
      title: '票数',
      dataIndex: 'candidateNumber',
      key: 'candidateNumber',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (_: any, {id}: any) => (
        <Space size="middle">
          <a onClick={() => showChildrenDrawer(id)}>投票的用户列表</a>
        </Space>
      ),
    },
  ];

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      width: 80
    },
    {
      title: '选举名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (text: string, v: any) => <a onClick={() => window.open(`#/voting?id=${v.id}`)}>{text}</a>
    },
    {
      title: '选举内容简介',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '选举状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (index: number) =><Tag color={['geekblue', 'green', 'volcano'][index]} >
      {statusArr[index]}
    </Tag>
      
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (createdDate: moment.MomentInput) => <a>{moment(createdDate).format('YYYY-MM-DD HH:mm:ss')}</a>,
      width: 190
    },
    {
      title: '更新时间',
      dataIndex: 'updatedDate',
      key: 'updatedDate',
      render: (updatedDate: moment.MomentInput) => <a>{moment(updatedDate).format('YYYY-MM-DD HH:mm:ss')}</a>,
      width: 190
    },
    
    {
      title: 'Action',
      key: 'operation',
      width: 220,
      render: (_: any, {id}: any) => <Space size="middle">
      <a style={{color: 'green'}} onClick={() => statusShowModal(id)}>修改状态</a>
      <a onClick={() => onOpenInfo(_, {id})}>投票详情</a>
      <a style={{color: 'red'}} onClick={() => deleteVoting({id})}>删除</a>
    </Space>
    },
  ];
  const userColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 86
    },
    {
      title: '昵称',
      dataIndex: 'username',
      key: 'username',
      width: 130
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
    },
  ]
  const onOpenInfo = async (_: string, {id}: any) => {
    await queryCandidateList(id)
    showDrawer()
  }



  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const showChildrenDrawer = (id: SetStateAction<string>) => {
    setCandidateId(id)
    setChildrenDrawer(true);
    queryUserList({
      id,
      pageSize: 10,
      pageNum: 1
    })
  };

  const onChildrenDrawerClose = () => {
    setChildrenDrawer(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    onModalFinish(ModalForm.getFieldsValue())
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const addItem = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!name) return;
    await addCandidate({username: name}, true, (data)=>{
      setItems(data.map((val:any) => `ID:${val.id}-名字:${val.username}`))
      setName('');
    })
  };
  const onModalFinish = (values: any) => {
    addElection({...values, candidateIds: values?.candidateIds?.map((v:string) => v.split('-')?.[0]?.split(':')?.[1])})
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const onSearchFinish = (values: any) => {
    queryElectionList({...values})
    console.log('Success:', values);
  };
  const statusShowModal = (id: SetStateAction<string>) => {
    setStatusId(id)
    setStatusVisible(true);
  };

  const statusHideModal = () => {
    setStatusVisible(false);
  };
  const statusChangeOk = () => {
    changeVotingStatus({id: statusId,status: statusVal})
    statusHideModal()
  }
  useEffect(()=> {
    if (isModalVisible) {
      setItems(candidateList.map((val:any) => `ID:${val.id}-名字:${val.username}`))
    } else {
      ModalForm.resetFields()
    }
  },[isModalVisible])
  useEffect(()=> {
    if (statusVisible) {
      setStatusVal('')
    }
  },[statusVisible])
  useMount(async () => {
    queryElectionList()
    findCandidate()
  })
  // changeVotingStatus
  return (
    <>
        <Form style={{ marginBottom: 20 }} form={form} name="horizontal_login" layout="inline" onFinish={onSearchFinish}>
          <Form.Item
            name="name"
            label="名字"
          >
            <Input placeholder="选举名称" />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
          >
            <Select
              showSearch
              placeholder="选择状态"
            >
              <Option value={0}>未开始</Option>
              <Option value={1}>进行中</Option>
              <Option value={2}>已结束</Option>
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Button
                type="primary"
                htmlType="submit"
              >
                查询
            </Button>
            <Button onClick={showModal}>
              新增选举记录
            </Button>
          </Form.Item>
        </Form>
      <Table
        loading={loading}
        rowKey="id"
        className="components-table-demo-nested"
        columns={columns}
        dataSource={electionList}
        pagination={{
          ...pagination,
            onChange: (pageNum,pageSize) => {queryElectionList({
              // id: candidateId,
              pageSize,
              pageNum
            })},
          }}
      />
      <Drawer
        title="选举详情"
        width={800}
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <Table rowKey="id" loading={candidateListLoading} columns={candidateColumns} dataSource={candidateData} pagination={false} />
        <Drawer
          title="投票的用户"
          width={600}
          closable={false}
          onClose={onChildrenDrawerClose}
          visible={childrenDrawer}
        >
          <Table rowKey="id" loading={userListLoading} columns={userColumns} dataSource={userList} pagination={{
              ...userListPagination,
              onChange: (pageNum,pageSize) => {queryUserList({
                id: candidateId,
                pageSize,
                pageNum
              })},
            }}
          />
        </Drawer>
      </Drawer>
      <Modal title="添加候选人记录" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          form={ModalForm}
          onFinish={onModalFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="选举名称"
            name="name"
            rules={[{ required: true, message: '请输入标题名称' }]}
          >
            <Input placeholder="请输入选举名称"  />
          </Form.Item>
          <Form.Item
            label="选举内容介绍"
            name="description"
          >
            <Input.TextArea placeholder="请输入选举内容介绍"/>
          </Form.Item>
          <Form.Item
            label="添加候选人"
            name="candidateIds"
            rules={[{ required: true, message: '候选人必填' }]}
          >
            <Select
              style={{ width: 300 }}
              placeholder="添加候选人, 不得少于2个"
              mode='multiple'
              showSearch
              dropdownRender={menu => (
                <>
                  {menu}
                  <Divider style={{ margin: '8px 0' }} />
                  <Space align="center" style={{ padding: '0 8px 4px' }}>
                    <Input placeholder="Please enter item" value={name} onChange={onNameChange} />
                    <Typography.Link onClick={addItem} style={{ whiteSpace: 'nowrap' }}>
                      <PlusOutlined /> 创建新的候选人
                    </Typography.Link>
                  </Space>
                </>
              )}
            >
              {items.map(item => (
                <Option key={item} name={item}>{item}</Option>
              ))}
            </Select>
          </Form.Item>

        </Form>
      </Modal>
      <Modal
        title={`修改id为${statusId}的记录状态`}
        visible={statusVisible}
        onOk={statusChangeOk}
        onCancel={statusHideModal}
        okText="确认"
        cancelText="取消"
      >
        <Select
          showSearch
          placeholder="选择状态"
          value={statusVal}
          style={{width: 300}}
          onChange={(v) => setStatusVal(v)}
        >
          <Option value={0}>未开始</Option>
          <Option value={1}>进行中</Option>
          <Option value={2}>已结束</Option>
        </Select>
      </Modal>
    </>
  );
};

export default App;