import AppRoutes from './routes/AppRoutes';
import { BrowserRouter } from 'react-router-dom';
import ReactQueryProvider from './providers/ReactQueryProvider';
import { createTheme, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
const theme = createTheme({
    /** Put your mantine theme override here */
});

const App = () => {
  return (
    <MantineProvider theme={theme}>
        <BrowserRouter>
            <ReactQueryProvider>
                <Notifications position="top-right" />
                <AppRoutes />
            </ReactQueryProvider>
        </BrowserRouter>
    </MantineProvider>
  );
};

export default App;