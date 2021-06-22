import React, { useCallback, useEffect, useState } from 'react';

import Post from '../../../components/Post';
import { Col, Modal, notification, Pagination, Radio, Row, Spin } from 'antd';
import { LoadingOutlined, EditOutlined, CheckSquareOutlined } from '@ant-design/icons';

import axiosConfiguration from '../../../axiosConfiguration/axiosConfigurations';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../../hooks/auth';

interface IPostResponse {
  totalRecords: number;
  nextPage: string;
  previousPage: string;
  data: IPostData[];
}

interface IPostData {
  id: any;
  description: string;
  createdAt: any;
  recomendDate: any;
  imageUrl: string;
  canEdit: string;
}

const ListPost: React.FC = () => {

  const { user } = useAuth();
  const history = useHistory();
  const [posts, setPosts] = useState<IPostResponse>();
  const [filterValue, setFilterValue] = React.useState('all');
  const [spinLoad, setSpinLoad] = useState(false);
  
  useEffect(() => {
    setSpinLoad(true);

    axiosConfiguration.get<IPostResponse>('api/Posts/List/' + filterValue)
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

  const handleAccept = useCallback((id: string) => {
  
    Modal.confirm({
      title: 'Aceitar post?',
      onOk() {
        axiosConfiguration.put(`api/Posts/Accept/${id}`)
          .then(() => {
            setFilterValue('acceptedDate');

            notification['success']({
              message: 'Post aceito',
              duration: 2
            });
          })
          .catch(err => {
            Modal.error({
              title: 'Erro',
              maskClosable: true,
              centered: true,
              content: err.response.data
            });
          });
      }
    });    
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
                {
                  user.role === 'Administrator'
                    ? <>
                        <li><Radio value="recomendedNotAcceptedYet">Recomendados ainda não aceitos</Radio></li>
                        <li><Radio value="recomendedAndAccepted">Recomendados e aceitos</Radio></li>
                        <li><Radio value="recomendDate">Data de recomendação</Radio></li>
                        <li><Radio value="acceptedDate">Data de aceitação</Radio></li>
                      </>
                    : <>
                        <li><Radio value="accepted">Meus posts aceitos</Radio></li>
                        <li><Radio value="myCreatedPosts">Meus posts ainda não aceitos/rejeitados</Radio></li>
                        <li><Radio value="notAccepted">Meus posts recusados</Radio></li>
                        <li><Radio value="onlyCommomUsersPosts">Posts de usuários comuns</Radio></li>
                      </>
                }
              </ul>
            </Radio.Group>
          </Col>
          <Col md={7}></Col>
        </Row>
        {
          posts &&
            posts.data.map(post => (
              <Row style={{ marginBottom: '30px' }} key={post.id}>
                <Col md={7}></Col>
                <Col md={10}>
                  <Post key={post.id}
                    initialText={post.description !== '' ? post.description : undefined}
                    textareaStyle={!!post.description ? undefined : { display: 'none' }}
                    initialImageSrc={post.imageUrl}
                    readonlyImage
                    readonlyTextArea
                    {
                      ...post.canEdit &&
                        {cardProps:{ actions: [<EditOutlined key="edit" onClick={() => history.push(`/posts/edit/${post.id}`, { postId: post.id })} />]}}
                    }
                    {
                      ...user.role === 'Administrator' && filterValue === 'recomendedNotAcceptedYet' &&
                        {cardProps:{ actions: [<CheckSquareOutlined key="edit" onClick={() => handleAccept(post.id)} />]}}
                    }
                  />
                </Col>
                <Col md={7}></Col>
              </Row>
            ))
        }
        <Row>
          <Col md={8}></Col>
          <Col md={8} style={{ alignItems: 'stretch' }}>
            <Pagination style={{ display: posts?.totalRecords == 0 || posts == undefined ? 'none' : 'block' }}
              defaultCurrent={1} 
              total={posts?.totalRecords} 
              size="small" 
              showSizeChanger
              onChange={async (page, pageSize) => {
                const postResponse: IPostResponse = await (await axiosConfiguration.get(`api/Posts/List/${filterValue}`, { params: { page: page, per_page: pageSize } })).data
                setPosts(postResponse);
              }}
              onShowSizeChange={async (currentPage, pageSize) => {
                const postResponse: IPostResponse =  await (await axiosConfiguration.get(`api/Posts/List/${filterValue}`, { params: { page: currentPage, per_page: pageSize } })).data
                setPosts(postResponse);
              }}
            />
          </Col>
          <Col md={8}></Col>
        </Row>
      </Spin>
    </>
  );
}

export default ListPost;
