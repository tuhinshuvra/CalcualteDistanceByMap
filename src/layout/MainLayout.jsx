import Navbar from '../Components/Shared/NavBar';
import Footer from '../Components/Shared/Footer';
import { Outlet } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div className='outletArea'>
                <Outlet></Outlet>
            </div>
            <Footer></Footer>

        </div>
    );
};

export default MainLayout;