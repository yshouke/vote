import { Table, Tag, Button, Form, Input, Spin, Select } from 'antd';

import type { ColumnsType } from 'antd/lib/table';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useMount, useSetState } from 'ahooks';
import { useModel } from 'umi';

interface DataType {
  key: string;
  name: string;
  age: number;
  id: number;
  address: string;
  tags: string[];
}
const { Option } = Select;

export default function UserListPage() {
  const [form] = Form.useForm();
  const { findUsers, userList, loading, pagination } = useModel('useUserList')
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
    {
      title: '账户类型',
      dataIndex: 'userType',
      key: 'userType',
      width: 90,
      render: text => <Tag color={text ? 'green' : 'volcano'} >
                  {text ? '普通用户' : '管理员'}
                </Tag>
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
  ];
  const onFinish = (values: any) => {
    console.log('Finish:', values);
    findUsers(values)
  };
  useMount(() => {
    findUsers()
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
          <Form.Item
            name="email"
            label="邮箱"

          >
            <Input placeholder="账户邮箱" />
          </Form.Item>
          <Form.Item
            name="userType"
            label="账户类型"
          >
            <Select
              showSearch
              placeholder="选择账户类型"
            >
              <Option value={0}>管理员</Option>
              <Option value={1}>普通用户</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="idCard"
            label="身份号码"
          >
            <Input placeholder="选择账户类型" />
          </Form.Item>
          
          <Form.Item shouldUpdate>
            {() => (
              <Button
                type="primary"
                htmlType="submit"
              >
                查询
              </Button>
            )}
          </Form.Item>
        </Form>
        
      <div>
        <Table scroll={{x: '100%'}} rowKey={'id'} columns={columns} dataSource={userList} pagination={{
          ...pagination,
          onChange: (pageNum,pageSize) => {findUsers({
            ...form.getFieldsValue(),
            pageSize,
            pageNum
          })},
        }} />
      </div>
      </Spin>      
    </>
  )
}