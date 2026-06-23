import ReactDOM from 'react-dom/client'
import App from './App'
import './assets/sccs/index.scss'
import { GoogleOAuthProvider } from '@react-oauth/google'

ReactDOM.createRoot(
  document.getElementById('root')!
).render(
  <GoogleOAuthProvider
    clientId="1057592252077-dd6m6aj5bid6b3gomkq67036mait600p.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
)