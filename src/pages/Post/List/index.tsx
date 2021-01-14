import React, { useEffect, useState } from 'react';

import Post from '../../../components/Post';
import { Col, notification, Row } from 'antd';

import axiosConfiguration from '../../../axiosConfiguration/axiosConfigurations';

interface IPost {
  id: any;
  description: string;
  createdAt: any;
  recomendDate: any;
  imageUrl: string;
}

const ListPost: React.FC = () => {

  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    axiosConfiguration.get<IPost[]>('api/Posts/List/all')
      .then(posts => setPosts(posts.data))
      .catch(err => {
        notification['error']({
          message: 'Erro',
          description: err.response.data.Message,
          duration: 2
        });
      });
  }, []);

  return (
    <>
      {
      posts &&
        posts.map(post => (
          <Row style={{ marginBottom: '30px' }}>
            <Col md={7}></Col>
            <Col md={10}>
              <Post key={post.id}
                initialText={post.description != '' ? post.description : undefined}
                textareaStyle={!!post.description ? undefined : { display: 'none' }}
                initialImageSrc={post.imageUrl}
                readonlyImage
                readonlyTextArea
              />
            </Col>
            <Col md={7}></Col>
          </Row>
        ))
      }
    </>
  );
}

export default ListPost;
