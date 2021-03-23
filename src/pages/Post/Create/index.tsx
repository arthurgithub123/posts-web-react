import React from 'react';

import Post from '../../../components/Post';
import { Col, Row } from 'antd';

const CreatePost: React.FC = () => {
  
  return (
    <Row>
      <Col md={7}></Col>
      <Col md={10}>
        <Post
          cancelButton
          cancelButtonAlert
          cancelButtonAlertMessage='Excluir imagem?'
          cancelButtonTooltipMessage='Preencha um dos campos'
          createPost
        />
      </Col>
      <Col md={7}></Col>
    </Row>
  );
}

export default CreatePost;
