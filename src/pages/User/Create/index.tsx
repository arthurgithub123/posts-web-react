import React, { useCallback, useState } from 'react';

import { useAuth } from '../../../hooks/auth';
import { useHistory } from 'react-router-dom';
import { Button, Card, Col, Form, Input, Modal, notification, Row, Spin } from 'antd';
import { UserOutlined, LockOutlined, LoadingOutlined } from '@ant-design/icons';
import Dropzone from '../../../components/Dropzone';
import axiosConfiguration from '../../../axiosConfiguration/axiosConfigurations';

const CreateUser: React.FC = () => {

  const { signInAfterAccountCreation } = useAuth();
  const history = useHistory();
  const [spinLoad, setSpinLoad] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);

  const handleSubmitSuccess = useCallback((values) => {

    setSpinLoad(true);

    const { name, email, password } = values;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    
    if(selectedImage !== undefined) formData.append('avatar', selectedImage);

    axiosConfiguration.post('api/Session/Commom/Create', formData)
      .then(userToken => {

        const { token, user } = userToken.data;

        signInAfterAccountCreation({ token, user });

        setSpinLoad(false);
        history.push('/dashboard');
      })
      .catch(err => {
        setSpinLoad(false);

        notification['error']({
          message: err.response.data,
          duration: 2
        });
      });
    
  }, [selectedImage]);

  return (
    <Spin tip="Carregando..." size="large" indicator={<LoadingOutlined spin />} spinning={spinLoad}>

      <Row justify="center" align="middle" style={{ textAlign: 'center', minHeight: '100vh', background: '#f2f2f2' }}>
        <Col xs={1} sm={7} md={9}></Col>
        <Col xs={22} sm={10} md={6}>
          <Card>
            <Form name="userForm" onFinish={handleSubmitSuccess}>

              <Form.Item name="name" rules={[{ required: true, min: 3, message: 'Nome obrigatório' }]}>
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Nome" />
              </Form.Item>

              <Form.Item name="email" rules={[{ required: true, min: 6, type: 'email', message: 'E-mail obrigatório' }]}>
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="E-mail" />
              </Form.Item>

              <Form.Item name="password" rules={[{ required: true, message: 'Senha obrigatória', min: 6 }]}>
                <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Senha" />
              </Form.Item>

              <Form.Item>
                <Dropzone onImageSelected={setSelectedImage} />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit">Cadastrar</Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col xs={1} sm={7} md={9}></Col>
      </Row>
    </Spin>
  );
}

export default CreateUser;