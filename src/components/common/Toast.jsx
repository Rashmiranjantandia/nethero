import { Toaster } from 'react-hot-toast';

export const Toast = () => {
  return (
    <Toaster
      position="bottom-center"
      gutter={12}
      containerStyle={{ zIndex: 9999 }}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#181818',
          color: '#FFFFFF',
          border: '1px solid #404040',
          borderRadius: '4px',
          fontSize: '0.875rem',
          padding: '12px 16px',
          maxWidth: '380px',
        },
        success: {
          iconTheme: {
            primary: '#46D369',
            secondary: '#181818',
          },
        },
        error: {
          iconTheme: {
            primary: '#E50914',
            secondary: '#181818',
          },
        },
      }}
    />
  );
};

export default Toast;
