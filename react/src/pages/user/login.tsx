import { Form, Input, Button } from 'antd';

import { useModel, history } from 'umi';

const App = () => {
  const { loginUser, loading } = useModel('useUserInfo');
  const onFinish = async (values: any) => {
    const data = await loginUser(values);
    data && history.push('/admin')
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="账户"
        name="username"
        rules={[
          {
            required: true,
            message: '请输入账户!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="密码"
        name="password"
        rules={[
          {
            required: true,
            message: '请输入密码!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit" loading={loading}>
          登录
        </Button>
      </Form.Item>
    </Form>
  );
};

export default App;