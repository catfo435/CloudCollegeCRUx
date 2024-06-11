import DashBoardNavBar from './DashBoardNavBar';
import { Outlet } from 'react-router-dom';

const Selector = () => {

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-blue-100">
        <DashBoardNavBar />
        <Outlet />
    </div>
  );
};

export default Selector;
