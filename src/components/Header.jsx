import Bell from '../assets/bell.svg';
import User from '../assets/user.svg';
import Settings from '../assets/settings.svg';

function Header() {
 return (
   <div className="p-4">
     <div className="flex items-center justify-end">
       {/* Bell Icon */}
       <div className="mr-4 bg-white p-2 rounded-xl">
         <img src={Bell} alt="Bell Icon" className="h-6 w-6" />
       </div>
     
       {/* Profile/User Icon */}
       <div className="mr-4 bg-white p-2 rounded-xl">
         <img src={User} alt="User Icon" className="h-6 w-6" />
       </div>

         {/* Settings Icon */}
         <div className="mr-4 bg-white p-2 rounded-xl">
         <img src={Settings} alt="Settings Icon" className="h-6 w-6" />
       </div>

     </div>
   </div>
 );
}

export default Header;