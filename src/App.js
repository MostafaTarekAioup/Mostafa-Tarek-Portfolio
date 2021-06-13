import './App.css';
import Loading from './Start-Loading/Loading'
import Login from './Login/Login'
import Desktop from './Desktop/Desktop'
import Submenu from './Submenu/Submenu'
// import {useGlopalContext} from './Context'
function App() {
//  const {isLoading} = useGlopalContext()

 return<>
   <main>
     <Loading/>
   <Login />
   <Desktop/>
   <Submenu/>
   </main>
 </>
}

export default App;
