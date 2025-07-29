
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './router/Routers'; // Ensure AppRoutes is the correct export

const App = () => {
    return (
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    );
}
export default App;