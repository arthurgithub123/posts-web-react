import React, { useCallback, useEffect, useState } from 'react';

import { useDropzone } from 'react-dropzone';
import { UploadOutlined, CloseOutlined } from '@ant-design/icons';

interface IProps {
  onImageSelected?(file: File | undefined): void;
  cancelButton?: boolean;
  initialImageSrc?: string | undefined;
  selectedImageStyle?: any;
  textIconStyle?: any;
  iconStyle?: any;
  cancelButtonStyle?: any;
}

const Dropzone: React.FC<IProps> = ({ 
  onImageSelected,
  cancelButton = false,
  selectedImageStyle,
  textIconStyle,
  iconStyle,
  cancelButtonStyle,
  initialImageSrc }) => {

  const [selectedFileUrl, setSelectedFileUrl] = useState('');

  useEffect(() => {
    if(initialImageSrc !== undefined) {
      setSelectedFileUrl(initialImageSrc);
    }
  }, [initialImageSrc]);

  const onDrop = useCallback((acceptedFiles) => {
    
    const file = acceptedFiles[0];
    const fileUrl = URL.createObjectURL(file);

    setSelectedFileUrl(fileUrl);
    onImageSelected !== undefined && onImageSelected(file);
  }, [onImageSelected]);

  const removeSelectedImage = useCallback(() => {
    setSelectedFileUrl('');
    onImageSelected !== undefined && onImageSelected(undefined);
  }, []);
 
  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

  return (
    <>
      <div {...getRootProps()}>
        <input {...getInputProps()} accept="image/*" />
        {
          selectedFileUrl
            ? <img src={selectedFileUrl} alt="selectedProfileImage" style={selectedImageStyle} />
            :
              <p style={textIconStyle}>
                <UploadOutlined style={iconStyle} />
                Clique ou arraste para a imagem
              </p>
        }
      </div>
      {
        selectedFileUrl && cancelButton
          &&
            <CloseOutlined 
              onClick={removeSelectedImage}
              style={cancelButtonStyle}
            />
      }
    </>
  );
}

export default Dropzone;
