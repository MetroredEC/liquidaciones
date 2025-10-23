import React, { useRef } from 'react';

/**
 * Dropzone component – provides a file input that supports drag
 * and drop as well as click selection. On selection it calls
 * the supplied onFiles callback with the FileList.
 */
const Dropzone = ({ onFiles, accept = '*' }) => {
  const inputRef = useRef();

  const handleFiles = files => {
    if (onFiles) {
      onFiles(files);
    }
  };

  const onDrop = event => {
    event.preventDefault();
    event.stopPropagation();
    const { files } = event.dataTransfer;
    handleFiles(files);
  };

  const openFileDialog = () => {
    inputRef.current.click();
  };

  return (
    <div>
      <div
        onClick={openFileDialog}
        onDrop={onDrop}
        onDragOver={e => e.preventDefault()}
        className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-400 rounded cursor-pointer hover:border-blue hover:bg-grayLight transition"
        style={{ minHeight: '150px' }}
      >
        <p className="text-gray text-center">
          Arrastre y suelte archivos aquí o haga clic para seleccionar
        </p>
      </div>
      <input
        type="file"
        multiple
        accept={accept}
        ref={inputRef}
        onChange={e => handleFiles(e.target.files)}
        className="hidden"
      />
    </div>
  );
};

export default Dropzone;