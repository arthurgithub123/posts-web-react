import React, { useEffect, useState } from 'react';

import axiosConfiguration from '../../../axiosConfiguration/axiosConfigurations';
import Post from '../../../components/Post';
import { Col, notification, Row, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';

interface IState {
  state: {
    postId: string;
  }
}

interface IPost {
  id: any;
  description: string;
  createdAt: any;
  recomendDate: any;
  imageUrl: string;
  canEdit: string;
}

const EditPost: React.FC = () => {

  const location: IState = useLocation();
  const [post, setPost] = useState<IPost>({} as IPost);
  const [spinLoad, setSpinLoad] = useState(true);

  useEffect(() => {

    const postId = location.state.postId;

    axiosConfiguration.get<IPost>(`api/Posts/ListById/${postId}`)
      .then(fetchedPost => {
        setPost(fetchedPost.data);
        setSpinLoad(false);
      })
      .catch(err => {
        setSpinLoad(false);
        notification['error']({
          message: 'Erro',
          description: err.response.data.Message,
          duration: 2
        });
      });
  }, [location.state.postId]);

  return (
    <Spin tip="Carregando..." size="large" indicator={<LoadingOutlined spin />} spinning={spinLoad}>
      <Row>
        <Col md={7}></Col>
        <Col md={10}>
          <Post
            initialText={post?.description !== null ? post.description : undefined}
            initialImageSrc={post?.imageUrl !== null ? post.imageUrl : undefined}
            cancelButton
            cancelButtonAlert
            cancelButtonAlertMessage = 'Excluir imagem?'
            cancelButtonTooltipMessage = 'Preencha um dos campos'
            editPost
            postId={location.state.postId}
          />
        </Col>
        <Col md={7}></Col>
      </Row>
    </Spin>
  );
}

export default EditPost;
