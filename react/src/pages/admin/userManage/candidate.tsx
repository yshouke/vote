import { Table, Button, Form, Input, Spin, Modal } from 'antd';

import type { ColumnsType } from 'antd/lib/table';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useMount } from 'ahooks';
import { useModel } from 'umi';
import { useState } from 'react';

interface DataType {
  key: string;
  name: string;
  age: number;
  id: number;
  address: string;
  tags: string[];
}

export default function UserListPage() {
  const [form] = Form.useForm();
  const { findCandidate, candidateList, addCandidate, loading, delCandidate } = useModel('useCandidate')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [addName, setAddName] = useState('')
  const columns: ColumnsType<DataType> = [
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
      title: '创建时间',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: createdDate => <a>{moment(createdDate).format('YYYY-MM-DD HH:mm:ss')}</a>,
      width: 160
    },
    {
      title: '更新时间',
      dataIndex: 'updatedDate',
      key: 'updatedDate',
      render: updatedDate => <a>{moment(updatedDate).format('YYYY-MM-DD HH:mm:ss')}</a>,
      width: 160
    },
    {
      title: '操作',
      dataIndex: 'ope',
      key: 'ope',
      render: (_, {id}) => <Button type="primary" danger onClick={() => delCandidate({id}, true
        )}>删除</Button>,
      width: 160
    },
  ];
  const onFinish = (values: any) => {
    console.log('Finish:', values);
    findCandidate(values)
  };
  const onAddClick = (values: any) => {
    showModal()
  };
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    addCandidate({username: addName}, true)
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setAddName('')
  };
  const nameChange = (v: any) => {
    setAddName(v.target.value)
  }
  useMount(() => {
    findCandidate()
  })
  return (
    <>
    <Spin spinning={loading}>
        <Form style={{ marginBottom: 20 }} form={form} name="horizontal_login" layout="inline" onFinish={onFinish}>
          <Form.Item
            name="username"
            label="名字"
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="名字" />
          </Form.Item>
          
          <Form.Item shouldUpdate>
            <Button
                type="primary"
                htmlType="submit"
              >
              查询
            </Button>
            <Button onClick={onAddClick}>
              新增候选人
            </Button>
          </Form.Item>
        </Form>
        <Modal title="新加候选人" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="候选人名字" value={addName} onChange={nameChange} />
        </Modal>
      <div>
        <Table scroll={{x: '100%'}} rowKey={'id'} columns={columns} dataSource={candidateList} />
      </div>
      </Spin>      
    </>
  )
}