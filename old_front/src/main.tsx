import { RouterProvider } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import { router } from './App'
import "./styles/Global.scss";


const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <RouterProvider router={router}/>
);