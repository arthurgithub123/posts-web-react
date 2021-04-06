import React, { useCallback, useEffect, useState } from 'react';

import { useDropzone } from 'react-dropzone';
import { UploadOutlined, CloseOutlined } from '@ant-design/icons';

interface IProps {
  onImageSelected(file: File | undefined): void;
}

const Dropzone: React.FC<IProps> = ({ onImageSelected }) => {

  const [selectedFileUrl, setSelectedFileUrl] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    
    const file = acceptedFiles[0];
    const fileUrl = URL.createObjectURL(file);

    setSelectedFileUrl(fileUrl);
    onImageSelected(file);
  }, [onImageSelected]);

  const removeSelectedImage = useCallback(() => {
    setSelectedFileUrl('');
    onImageSelected(undefined);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

  return (
    <>
      <div {...getRootProps()}>
        <input {...getInputProps()} accept="image/*" />
        {
          selectedFileUrl
            ? <img src={selectedFileUrl} alt="selectedProfileImage" style={{ width: '100%', maxHeight: '546px'}} />
            :
              <p>
                <UploadOutlined style={{ marginRight: '10px' }} /> Clique ou arraste para a imagem de perfil
              </p>
        }
      </div>
      {
        <CloseOutlined 
          onClick={removeSelectedImage}
          style={ selectedFileUrl ? { position: 'absolute', right: 1,  top: 1, padding: '1px', background: 'gray' } : { display: 'none' }}
        />
      }
    </>
  );
}

export default Dropzone;
