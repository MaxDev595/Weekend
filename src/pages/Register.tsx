import '../assets/sccs/register.scss'
import logo from '../assets/img/register/logo_final.png'
import google from '../assets/img/register/icons8-google-96.png'
import { useGoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'

function Register() {
    const navigate = useNavigate()
    const login = useGoogleLogin({
        flow: 'implicit',
        onSuccess: async (tokenResponse) => {
            try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                })
                const user = await res.json()
                localStorage.setItem('user', JSON.stringify(user))

                await fetch('http://localhost:3000/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: user.email,
                        name: user.name,
                        picture: user.picture
                    })
                })

                navigate('/home')
            } catch (err) {
                console.error('Ошибка:', err)
            }
        },
        onError: () => console.log('Ошибка входа'),
    })

    return (
        <div className='register'>
            <div className='register__wrapper'>
                <div className='box_reg'>
                    <div className="block-text">
                        <div className='pic--reg'>
                            <img src={logo} alt="logo" />
                        </div>
                        <h3 className='title title--reg'>
                            Вход в Weekend
                        </h3>
                        <p className='text-reg'>
                            Выберите способ входа
                        </p>
                    </div>
                    <button className='btn-reg' onClick={() => login()}>
                        <img src={google} alt="google-logo" />
                        Войти через Google
                    </button>
                </div>
                <a className='help--reg' href="#">Помощь</a>

                <div className="footer-reg">
                    © Целико и полность вдохновлен <a target='_blank' href="https://vk.com/feed">ВКонтакте</a>
                </div>
            </div>
        </div>
    )
}

export default Register;