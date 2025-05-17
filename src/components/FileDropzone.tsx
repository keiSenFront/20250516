import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useAppState } from '../contexts/globalContexts';

pdfjs.GlobalWorkerOptions.workerSrc = '/js/pdf.worker.min.js';

interface FileDropzoneProps {
  onFileLoad: (file: File) => void;
  file: File | null;
}

export default function FileDropzone({ onFileLoad, file }: FileDropzoneProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { state, dispatch } = useAppState();

  useEffect(() => {
    if (numPages) {
      for (let i = 0; i < numPages; i++) {
        dispatch({ type: 'INIT_PAGE', payload: { pageIndex: i } });
      }
    }
  }, [numPages, dispatch]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        onFileLoad(file);
        setPreviewUrl(URL.createObjectURL(file));
        dispatch({ type: 'RESET_SIZE' });
        dispatch({ type: 'RESET_ROTATE' });
      }
    },
    [onFileLoad, dispatch]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleRotate = (pageIndex: number) => {
    console.log(state.pages);
    dispatch({ type: 'ROTATE', payload: { pageIndex } });
  };

  return (
    <>
      {!file ? (
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''}`}
        >
          <div className="relative h-[350px] w-[275px] text-center">
            <input {...getInputProps()} />
            <label className="flex h-full items-center justify-center rounded border border-dashed border-stone-300 bg-white transition-all">
              <div className="flex cursor-pointer flex-col items-center space-y-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="h-8 w-8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                  ></path>
                </svg>
                <p className="pointer pointer-events-none text-sm leading-6 font-medium opacity-75">
                  Click to upload or drag and drop
                </p>
              </div>
            </label>
          </div>
        </div>
      ) : (
        <>
          <Document
            className="flex flex-wrap justify-center"
            file={previewUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div>Loading...</div>}
            error={<div>Error</div>}
          >
            {numPages &&
              Array.from(new Array(numPages), (_, index) => (
                <div
                  key={`page_${index + 1}`}
                  className="m-3 flex-none"
                  style={{
                    maxWidth: `${state.size}px`,
                    width: `${state.size}px`,
                  }}
                >
                  <div className="pdf-page relative cursor-pointer">
                    <div
                      className="absolute top-1 right-1 z-10 rounded-full bg-[#ff612f] fill-white p-1 hover:scale-105 hover:fill-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRotate(index);
                      }}
                    >
                      <svg
                        className="w-3"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M142.9 142.9c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5c0 0 0 0 0 0H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5c7.7-21.8 20.2-42.3 37.8-59.8zM16 312v7.6 .7V440c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l41.6-41.6c87.6 86.5 228.7 86.2 315.8-1c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.2 62.2-162.7 62.5-225.3 1L185 329c6.9-6.9 8.9-17.2 5.2-26.2s-12.5-14.8-22.2-14.8H48.4h-.7H40c-13.3 0-24 10.7-24 24z"></path>
                      </svg>
                    </div>
                    <div className="overflow-hidden transition-transform">
                      <div className="relative flex h-full w-full flex-col items-center justify-between bg-white p-3 shadow-md hover:bg-gray-50">
                        <div className="pointer-events-none w-full shrink">
                          <div
                            className="transition-transform"
                            style={{
                              transform: `rotate(${state.pages[index]?.rotation || 0}deg)`,
                            }}
                          >
                            <Page
                              pageNumber={index + 1}
                              renderTextLayer={false}
                              renderAnnotationLayer={false}
                            />
                          </div>
                          <div className="w-[90%] shrink-0 overflow-hidden text-center text-xs text-ellipsis whitespace-nowrap italic">
                            {index + 1}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </Document>
        </>
      )}
    </>
  );
}
