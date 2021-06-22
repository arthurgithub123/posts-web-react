import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';

import { Button, Card, Spin } from 'antd';
import { CardProps } from 'antd/lib/card';

import { useDropzone } from 'react-dropzone';
import { notification, Modal } from 'antd';
import { ExclamationCircleOutlined, LoadingOutlined, UploadOutlined, CloseOutlined } from '@ant-design/icons';

import axiosConfiguration from '../../axiosConfiguration/axiosConfigurations';
import { useHistory } from 'react-router-dom';

interface IProps {
  // setSelectedImageProp?(file: File | undefined): void;
  // setTextProp?(text: string): void;
  cancelButton?: boolean;
  initialImageSrc?: string | undefined;
  readonlyImage?: boolean;
  initialText?: string | undefined;
  textareaStyle?: any;
  readonlyTextArea?: boolean;
  selectedImageStyle?: any;
  textIconStyle?: any;
  iconStyle?: any;
  cancelButtonStyle?: any;
  cardProps?: CardProps;
  cancelButtonAlert?: boolean;
  cancelButtonAlertMessage?: string;
  // cancelButtonTooltip?: boolean;
  cancelButtonTooltipMessage?: string;
  postId?: string | undefined;
  editPost?: boolean;
  createPost?: boolean;
}

const Post: React.FC<IProps> = ({
  textareaStyle, 
  readonlyTextArea = false,
  selectedImageStyle, 
  readonlyImage = false,
  textIconStyle, 
  iconStyle, 
  cancelButtonStyle,
  cancelButton = false,
  initialImageSrc,
  initialText,
  cardProps,
  cancelButtonAlert = false,
  cancelButtonAlertMessage = '',
  cancelButtonTooltipMessage = '',
  postId = undefined,
  editPost = false,
  createPost = false
}) => {

  const history = useHistory();
  const [spinLoad, setSpinLoad] = useState(false);

  useEffect(() => {
    setTextValue(initialText !== undefined ? initialText : '');
    setSelectedFileUrl(initialImageSrc);

    if(initialImageSrc !== undefined) {
      setSelectedFileUrl(initialImageSrc);
      setSelectedImage(new File([''], ''));
    }
    else {
      setSelectedFileUrl(undefined);
      setSelectedImage(undefined);
    }
  }, [initialText, initialImageSrc]);
  
  // POST
  const [textValue, setTextValue] = useState('');

  const handleTextareaChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => { 
    setTextValue(event.target.value); 
  }, []);

  const defaultTextareaStyles = {
    width: '100%',
    minHeight: '200px',
    maxHeight: '200px',
    borderStyle: 'none',
    border: '1px solid rgba(255, 0, 0, 0.1)',
    fontFamily: 'Roboto, sans-serif',
    padding: '2px 5px',
    marginBottom: '14px'
  };

  const defaultDropzoneSelectedImageStyle = {
    width: '100%',
    maxHeight: '546px'
  }

  const defaultDropzoneTextIconStyle = {
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center'
  }

  const defaultDropzoneIconStyle = {
    marginRight: '10px'
  }

  const defaultDropzoneCancelButtonStyle = {
    position: 'absolute', 
    right: 25, 
    top: 241, 
    padding: '1px', 
    background: 'gray'
  }

  // DROPZONE
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | undefined>(undefined);
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);
  const { confirm } = Modal;

  const onDrop = useCallback((acceptedFiles) => {
    setSpinLoad(true);
    setSelectedImage(acceptedFiles[0]);
    setSelectedFileUrl(URL.createObjectURL(acceptedFiles[0]));
    setSpinLoad(false);
  }, [selectedImage, textValue]);

  const removeSelectedImage = useCallback(() => {

    if(!textValue) {
      notification['error']({
        message: 'Erro',
        description: cancelButtonTooltipMessage,
        duration: 2
      });

      return;
    }

    if(cancelButtonAlert) {
      if(textValue === '') {
        notification['error']({
          message: 'Erro',
          description: cancelButtonTooltipMessage,
          duration: 2
        });

        return;
      }

      confirm({
        title: cancelButtonAlertMessage,
        icon: <ExclamationCircleOutlined />,
        onOk() {
          setSelectedImage(undefined);
          setSelectedFileUrl('');
        }
      });
    }
    else {
      setSelectedImage(undefined);
      setSelectedFileUrl('');
    }
  }, [textValue, cancelButtonAlert, cancelButtonAlertMessage, cancelButtonTooltipMessage, confirm]);
 
  const handleSubmit = useCallback(() => {

    if(!selectedImage && !textValue) {
      notification['error']({
        message: 'Erro',
        description: cancelButtonTooltipMessage,
        duration: 2
      });
  
      return;
    }

    setSpinLoad(true);

    const formData = new FormData();
    
    if(editPost) formData.append('id', '' + postId);
    
    formData.append('description', textValue);

    if(selectedImage !== undefined) {

      if(selectedImage.size == 0) {
        formData.append('imageUrl', 'notChanged');
      }
      else {
        formData.append('imageUrl', 'notNull')
        formData.append('image', selectedImage);
      }
    }
    else {
      formData.append('imageUrl', '');
    }
    
    if(createPost) {
      
      axiosConfiguration.post('api/Posts', formData)
        .then(() => {
          setSpinLoad(false);
          
          notification['success']({
            message: 'Post criado',
            duration: 2
          });

          history.push('/posts/list');
        })
        .catch(err => {
          setSpinLoad(false);

          notification['error']({
            message: 'Erro',
            description: err.response.data.Message,
            duration: 2
          });
        });
    }
    
    if(editPost) {

      axiosConfiguration.put(`api/Posts/Edit/${postId}`, formData)
        .then(() => {
          setSpinLoad(false);
          
          notification['success']({
            message: 'Post alterado',
            duration: 2
          });

          history.push('/posts/list');
        })
        .catch(err => {
          setSpinLoad(false);

          notification['error']({
            message: 'Erro',
            description: err.response.data.Message,
            duration: 2
          });
        });
    }
  }, [selectedImage, textValue, editPost, history, postId]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

  return (
    <Spin tip="Carregando..." size="large" indicator={<LoadingOutlined spin />} spinning={spinLoad}>
      <Card hoverable {...cardProps}>
        <textarea
          onChange={handleTextareaChange}
          style={!(!!textareaStyle) ? defaultTextareaStyles : { ...defaultTextareaStyles, ...textareaStyle }}
          value={textValue}
          readOnly={readonlyTextArea}
        >
        </textarea>

        <div {...getRootProps()} style={{ pointerEvents: readonlyImage ? 'none' : 'auto' }}>
          <input {...getInputProps()} accept="image/*" />
          {
            readonlyImage && !(!!selectedFileUrl)
              ? null
              :
              selectedFileUrl
                ? <img src={selectedFileUrl} alt="selectedProfileImage" style={!(!!selectedImageStyle) ? defaultDropzoneSelectedImageStyle : { ...defaultDropzoneSelectedImageStyle, ...selectedImageStyle }} />
                :
                <p style={!(!!textIconStyle) ? defaultDropzoneTextIconStyle : { ...defaultDropzoneTextIconStyle, ...textIconStyle }}>
                  <UploadOutlined style={!(!!iconStyle) ? defaultDropzoneIconStyle : { ...defaultDropzoneIconStyle, ...iconStyle }} />
                    Clique ou arraste para a imagem
                  </p>
          }
        </div>
        {
          selectedFileUrl && cancelButton
          &&
          <CloseOutlined
            onClick={removeSelectedImage}
            style={!(!!cancelButtonStyle) ? defaultDropzoneCancelButtonStyle : { ...defaultDropzoneCancelButtonStyle, ...cancelButtonStyle }}
          />
        }

        {
          (editPost || createPost)
            &&
              <Button type="primary" block onClick={handleSubmit}>{ createPost ? 'Criar' : 'Alterar' }</Button>
        }
      </Card>
    </Spin>
    
  );
}

export default Post;
