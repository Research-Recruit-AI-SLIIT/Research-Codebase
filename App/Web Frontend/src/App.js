import './App.css';
import { Routes } from 'react-router-dom';
import { getRoutes } from './routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainLayout from './layouts/MainLayout';
import { AuthContext } from './store/auth';
import { useContext } from 'react';
import { InterviewProvider } from './store/interview';

// axios.defaults.baseURL = 'http://localhost:8000';

function App() {
	const { getRole } = useContext(AuthContext);
	const role = getRole();
	return (
		<InterviewProvider>
			<div className='app'>
				<ToastContainer position='top-right' />
				<MainLayout>
					<Routes>{getRoutes(role)}</Routes>
				</MainLayout>
			</div>
		</InterviewProvider>
	);
}

export default App;
