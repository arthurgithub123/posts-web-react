import React, { useCallback, useEffect, useState } from 'react';

import Post from '../../../components/Post';
import { Col, notification, Radio, Row, Spin } from 'antd';
import { LoadingOutlined, EditOutlined } from '@ant-design/icons';

import axiosConfiguration from '../../../axiosConfiguration/axiosConfigurations';
import { useHistory } from 'react-router-dom';

interface IPost {
  id: any;
  description: string;
  createdAt: any;
  recomendDate: any;
  imageUrl: string;
  canEdit: string;
}

const ListPost: React.FC = () => {

  const history = useHistory();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [filterValue, setFilterValue] = React.useState('all');
  const [spinLoad, setSpinLoad] = useState(false);

  useEffect(() => {
    setSpinLoad(true);

    axiosConfiguration.get<IPost[]>('api/Posts/List/' + filterValue)
      .then(posts => {
        setPosts(posts.data);
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
  }, [filterValue]);

  const handleFilterValueChange = useCallback((event) => {
    setFilterValue(event.target.value);
  }, []);

  return (
    <>
      <Spin tip="Carregando..." size="large" indicator={<LoadingOutlined spin />} spinning={spinLoad}>
        <Row style={{ marginBottom: '30px' }}>
          <Col md={7}></Col>
          <Col md={10} style={{ textAlign: 'center' }}>
            <Radio.Group onChange={handleFilterValueChange} value={filterValue}>
              <ul>
                <li><Radio value="all">Todos</Radio></li>
                <li><Radio value="onlyAdministratorsPosts">Posts de administradores</Radio></li>
                <li><Radio value="recomendedNotAccepted">Recomendados e não aceitos</Radio></li>
                <li><Radio value="recomendedAndAccepted">Recomendados e aceitos</Radio></li>
                <li><Radio value="recomendDate">Data de recomendação</Radio></li>
                <li><Radio value="acceptedDate">Data de aceitação</Radio></li>
              </ul>
            </Radio.Group>
          </Col>
          <Col md={7}></Col>
        </Row>
        {
          posts &&
          posts.map(post => (
            <Row style={{ marginBottom: '30px' }}>
              <Col md={7}></Col>
              <Col md={10}>
                {
                  post.canEdit
                    ?
                      <Post key={post.id}
                        initialText={post.description != '' ? post.description : undefined}
                        textareaStyle={!!post.description ? undefined : { display: 'none' }}
                        initialImageSrc={post.imageUrl}
                        readonlyImage
                        readonlyTextArea
                        cardProps={
                          {
                            actions: [
                              <EditOutlined key="edit" onClick={() => history.push(`/posts/edit/${post.id}`, { postId: post.id })} />
                            ] 
                          }
                        }
                    />
                  :
                    <Post key={post.id}
                      initialText={post.description != '' ? post.description : undefined}
                      textareaStyle={!!post.description ? undefined : { display: 'none' }}
                      initialImageSrc={post.imageUrl}
                      readonlyImage
                      readonlyTextArea
                    />
                }
                
              </Col>
              <Col md={7}></Col>
            </Row>
          ))
        }
      </Spin>
    </>
  );
}

export default ListPost;
