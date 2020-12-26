import React, { useCallback } from 'react';

import { Form, Input, Button, Checkbox, Row, Col, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const SignIn: React.FC = () => {

  return (
    <Row justify="center" align="middle" style={{ textAlign: 'center', minHeight: '100vh', background: '#f2f2f2' }}>
      <Col xs={1} sm={7} md={9}></Col>
      <Col xs={22} sm={10} md={6}>
        <Card>
          <Form name="normal_login" className="login-form">

            <Form.Item name="email" rules={[{
              required: true,
              min: 6,
              type: 'email',
              message: 'E-mail obrigatório'
            }]}>
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="E-mail" />
            </Form.Item>

            <Form.Item name="password" rules={[{
              required: true,
              message: 'Senha obrigatória',
              min: 6
            }]}>
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Senha"
              />
            </Form.Item>

            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Lembrar-me</Checkbox>
              </Form.Item>
              <a className="login-form-forgot" href="">
                Esqueci a senha
            </a>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                Entre
              </Button>
              <div>Ou</div>
              <a href="">Registre-se</a>
            </Form.Item>
          </Form>
        </Card>
      </Col>
      <Col xs={1} sm={7} md={9}></Col>
    </Row>
  );
}

export default SignIn;