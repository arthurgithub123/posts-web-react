import React, { useCallback, useRef, useState } from 'react';

import { Button, Col, notification, Row } from 'antd';
import Post from '../../../components/Post';
import axiosConfiguration from '../../../axiosConfiguration/axiosConfigurations';
import { useHistory } from 'react-router-dom';

const CreatePost: React.FC = () => {

  const history = useHistory();
  
  const [selectedImage, setSelectedImage] = useState<File | undefined>();
  const [textValue, setTextValue] = useState('');

  const handleSetTextValue = useCallback((value) => { 
    setTextValue(value); 
  }, [textValue]);

  const handlePostSubmit = useCallback(() => {

    if(!selectedImage && !textValue) {
      notification['error']({
        message: 'Erro',
        description: 'Preencha um dos campos',
        duration: 2
      });

      return;
    }

    const formData = new FormData();
    formData.append('description', textValue);
    if (selectedImage) formData.append('image', selectedImage);

    axiosConfiguration.post('api/Posts/Create', formData)
      .then(() => history.push('/posts/list'))
      .catch(err => {
        notification['error']({
          message: 'Erro',
          description: err.response.data.Message,
          duration: 2
        });
      });
    
  }, [selectedImage, textValue]);

  return (
    <>
      <Row>
        <Col md={7}></Col>
        <Col md={10}>
          <Post
            setSelectedImageProp={setSelectedImage}
            setTextProp={handleSetTextValue}
            cancelButton
          />
          <Button type="primary" block onClick={handlePostSubmit}>Postar</Button>
        </Col>
        <Col md={7}></Col>
      </Row>
    </>
  );
}

export default CreatePost;
