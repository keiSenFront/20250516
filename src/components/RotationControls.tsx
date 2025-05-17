import { Tooltip } from 'react-tooltip';
import { useAppState } from '../contexts/globalContexts';

interface RotationControlsProps {
  file: File | null;
  onReset: () => void;
}

export default function RotationControls({
  file,
  onReset,
}: RotationControlsProps) {
  const { state, dispatch } = useAppState();

  const handleRotationChange = () => {
    dispatch({ type: 'ROTATE_ALL' });
  };

  const handleIncreaseSize = () => {
    dispatch({ type: 'INCREASE_SIZE' });
  };

  const handleDecreaseSize = () => {
    dispatch({ type: 'DECREASE_SIZE' });
  };

  return (
    <>
      <button
        className="sc-7ff41d46-0 aEnZv !w-auto"
        onClick={() => handleRotationChange()}
        disabled={!file || state.isProcessing}
      >
        Rotate all
      </button>
      <button
        className="sc-7ff41d46-0 aEnZv !w-auto !bg-gray-800"
        onClick={onReset}
        disabled={!file || state.isProcessing}
        aria-label="Remove this PDF and select a new one"
        data-tooltip-id="reset-tooltip"
        data-tooltip-content="Remove this PDF and select a new one"
      >
        <Tooltip id="reset-tooltip" />
        Remove PDF
      </button>
      <button
        className="flex shrink-0 grow-0 cursor-pointer items-center justify-center rounded-full !bg-white bg-[#ff612f] p-2 shadow hover:scale-105 disabled:opacity-50"
        aria-label="Zoom in"
        data-tooltip-id="in-tooltip"
        data-tooltip-content="Zoom in"
        onClick={handleIncreaseSize}
        disabled={state.size === 500}
      >
        <Tooltip id="in-tooltip" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
          ></path>
        </svg>
      </button>

      <button
        className="flex shrink-0 grow-0 cursor-pointer items-center justify-center rounded-full !bg-white bg-[#ff612f] p-2 shadow hover:scale-105 disabled:opacity-50"
        aria-label="Zoom out"
        data-tooltip-id="out-tooltip"
        data-tooltip-content="Zoom out"
        onClick={handleDecreaseSize}
        disabled={state.size === 0}
      >
        <Tooltip id="out-tooltip" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
          ></path>
        </svg>
      </button>
    </>
  );
}
