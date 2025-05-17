// context/RotationContext.tsx
import { createContext, useContext, useReducer, ReactNode } from 'react';

type PageState = {
  rotation: number;
};

type AppState = {
  pages: Record<number, PageState>; 
  size: number;
  isProcessing: boolean;
};

type AppAction = 
  | { type: 'ROTATE'; payload: { pageIndex: number } }
  | { type: 'ROTATE_ALL' } 
  | { type: 'RESET_ROTATE' } 
  | { type: 'INIT_PAGE'; payload: { pageIndex: number } }
  | { type: 'INCREASE_SIZE' }
  | { type: 'DECREASE_SIZE' }
  | { type: 'RESET_SIZE' }
  | { type: 'SET_PROCESSING'; payload: boolean };

const initialState: AppState = {
  pages: {},
  size: 200,
  isProcessing: false,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'INIT_PAGE':
      return {
        ...state,
        pages: {
          ...state.pages,
          [action.payload.pageIndex]: {
            rotation: 0,
          },
        },
      };
    case 'ROTATE':
      return {
        ...state,
        pages: {
          ...state.pages,
          [action.payload.pageIndex]: {
            rotation: (state.pages[action.payload.pageIndex]?.rotation || 0) + 90,
          },
        },
      };
    case 'ROTATE_ALL': // 新增旋转所有页面的reducer处理
      const rotatedPages: Record<number, PageState> = {};
      Object.keys(state.pages).forEach(key => {
        const pageIndex = Number(key);
        rotatedPages[pageIndex] = {
          rotation: state.pages[pageIndex].rotation + 90,
        };
      });
      return {
        ...state,
        pages: rotatedPages,
      };
    case 'RESET_ROTATE':
      return {
        ...state,
        pages: {},
      }
    case 'INCREASE_SIZE':
      return {
        ...state,
        size: Math.min(state.size + 50, 500), // 最大500px
      };
    case 'DECREASE_SIZE':
      return {
        ...state,
        size: Math.max(state.size - 50, 50), // 最小50px
      };
    case 'RESET_SIZE':
      return {
        ...state,
        size: 200,
      };
    case 'SET_PROCESSING':
      return {
        ...state,
        isProcessing: action.payload,
      };
    default:
      return state;
  }
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  return useContext(AppContext);
};