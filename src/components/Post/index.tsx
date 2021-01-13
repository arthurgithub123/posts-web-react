import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';

import Dropzone from '../Dropzone';
import { Card } from 'antd';
import { CardProps } from 'antd/lib/card';

interface IProps {
  setSelectedImageProp?(file: File | undefined): void;
  setTextProp?(text: string): void;
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
}

const Post: React.FC<IProps> = ({ 
  setSelectedImageProp, 
  setTextProp, 
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
  cardProps}) => {

    const [textValue, setTextValue] = useState('');

  const handleTextareaChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    
    setTextProp !== undefined && 
      setTextProp(event.target.value);

    setTextValue(event.target.value);
  }, [setTextProp]);

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

  return (
    <Card hoverable {...cardProps}>
      <textarea 
        onChange={handleTextareaChange} 
        style={ !(!!textareaStyle) ? defaultTextareaStyles : { ...defaultTextareaStyles, ...textareaStyle }}
        value={initialText !== undefined ? initialText : textValue}
        readOnly={readonlyTextArea}
      >
      </textarea>

      <Dropzone
        onImageSelected={setSelectedImageProp}
        selectedImageStyle={!selectedImageStyle ? defaultDropzoneSelectedImageStyle : { ...defaultDropzoneSelectedImageStyle, ...selectedImageStyle }}
        textIconStyle={!textIconStyle ? defaultDropzoneTextIconStyle: { ...defaultDropzoneTextIconStyle, ...textIconStyle }}
        iconStyle={!iconStyle ? defaultDropzoneIconStyle : { ...defaultDropzoneIconStyle, ...iconStyle }}
        cancelButtonStyle={!cancelButtonStyle ? defaultDropzoneCancelButtonStyle : { ...defaultDropzoneCancelButtonStyle, ...cancelButtonStyle }}
        cancelButton={cancelButton}
        initialImageSrc={initialImageSrc != undefined ? initialImageSrc : undefined}
        readonlyImage={readonlyImage}
      />
    </Card>
  );
}

export default Post;