import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Layout = () => {
  
    return (
        <div className="min-h-screen bg-[url('./assets/background.png')] bg-cover">
            <Navbar />
            <div className="pt-16">
                <Outlet />
            </div>
        </div>
    )
}

export default Layout
