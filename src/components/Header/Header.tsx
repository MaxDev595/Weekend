import './Header.scss'
import logo from '../../assets/img/register/logo_final.png'
import fallbackAvatar from '../../assets/img/avatar-fallback.svg'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Header() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [bellOpen, setBellOpen] = useState(false)
    const [musicOpen, setMusicOpen] = useState(false)

    const menuRef = useRef<HTMLLIElement>(null)
    const bellRef = useRef<HTMLLIElement>(null)
    const musicRef = useRef<HTMLLIElement>(null)

    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node

            if (menuRef.current && !menuRef.current.contains(target)) {
                setMenuOpen(false)
            }
            if (bellRef.current && !bellRef.current.contains(target)) {
                setBellOpen(false)
            }
            if (musicRef.current && !musicRef.current.contains(target)) {
                setMusicOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('user')
        navigate('/')
    }

    console.log(user);
    console.log(user.picture);

    return (
        <header className="header">
            <ul className="header-nav">
                
                <li className="header-item item-logo">
                    <a href="/home">
                        <img className="logo" src={logo} alt="logo" />
                        <p>Weekend</p>
                    </a>
                </li>

                <li className="header-item header-lupa">
                    <svg viewBox="0 0 24 24" fill="none">
                        <circle cx="9.14" cy="9.14" r="7.64" stroke="#939393" strokeWidth="1.91" />
                        <line x1="22.5" y1="22.5" x2="14.39" y2="14.39" stroke="#939393" strokeWidth="1.91" strokeLinecap="round" />
                    </svg>
                    <input className="search-input" type="search" placeholder="Поиск" />
                </li>

                <li ref={bellRef} className="header-item header-btn bell-icon">
                    <button type="button" onClick={() => { setBellOpen((prev) => !prev); setMusicOpen(false); setMenuOpen(false) }}>
                        <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path
                                    d="M9.00195 17H5.60636C4.34793 17 3.71872 17 3.58633 16.9023C3.4376 16.7925 3.40126 16.7277 3.38515 16.5436C3.37082 16.3797 3.75646 15.7486 4.52776 14.4866C5.32411 13.1835 6.00031 11.2862 6.00031 8.6C6.00031 7.11479 6.63245 5.69041 7.75766 4.6402C8.88288 3.59 10.409 3 12.0003 3C13.5916 3 15.1177 3.59 16.2429 4.6402C17.3682 5.69041 18.0003 7.11479 18.0003 8.6C18.0003 11.2862 18.6765 13.1835 19.4729 14.4866C20.2441 15.7486 20.6298 16.3797 20.6155 16.5436C20.5994 16.7277 20.563 16.7925 20.4143 16.9023C20.2819 17 19.6527 17 18.3943 17H15.0003M9.00195 17L9.00031 18C9.00031 19.6569 10.3435 21 12.0003 21C13.6572 21 15.0003 19.6569 15.0003 18V17M9.00195 17H15.0003"
                                    stroke="#828282"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                ></path>
                            </g>
                        </svg>
                    </button>
                </li>

                {bellOpen && <div className="header-tooltip">У вас ещё нет уведомлений</div>}

                <li ref={musicRef} className="header-item header-btn music-icon">
                    <button type="button" onClick={() => { setMusicOpen((prev) => !prev); setBellOpen(false); setMenuOpen(false) }}>
                        <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path d="M9 19C9 20.6569 7.65685 22 6 22C4.34315 22 3 20.6569 3 19C3 17.3431 4.34315 16 6 16C7.65685 16 9 17.3431 9 19Z" stroke="#828282" strokeWidth="1.5"></path>
                                <path d="M21 17C21 18.6569 19.6569 20 18 20C16.3431 20 15 18.6569 15 17C15 15.3431 16.3431 14 18 14C19.6569 14 21 15.3431 21 17Z" stroke="#828282" strokeWidth="1.5"></path>
                                <path opacity="0.5" d="M9 19V8" stroke="#828282" strokeWidth="1.5"></path>
                                <path opacity="0.5" d="M21 17V6" stroke="#828282" strokeWidth="1.5"></path>
                                <path d="M15.7351 3.75466L11.7351 5.08799C10.4151 5.52801 9.75503 5.74801 9.37752 6.27179C9 6.79556 9 7.49128 9 8.88273V11.9997L21 7.99969V7.54939C21 5.01693 21 3.7507 20.1694 3.15206C19.3388 2.55341 18.1376 2.95383 15.7351 3.75466Z" stroke="#828282" strokeWidth="1.5" strokeLinecap="round"></path>
                            </g>
                        </svg>
                    </button>
                </li>

                {musicOpen && <div className="header-tooltip">У вас ещё нет музыки</div>}

                <li ref={menuRef} className={`header-item header-account ${menuOpen ? 'active' : ''}`}>
                    <div className='account-icon' onClick={() => setMenuOpen(!menuOpen)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <svg fill="#828282" width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path d="M12 16a1 1 0 0 1-.707-.293L5.636 10.05A1 1 0 0 1 7.05 8.636l4.95 4.95 4.95-4.95a1 1 0 0 1 1.414 1.414l-5.657 5.657A1 1 0 0 1 12 16z"></path>
                            </g>
                        </svg>
                        <img src={user.picture || fallbackAvatar} alt="avatar" />
                    </div>
                    <div className={`menu-open ${menuOpen ? 'menu-open--visible' : ''}`}>
                        <div className="account-block">
                            <div className="menu-email">
                                <img src={user.picture || fallbackAvatar} alt="avatar" />
                                <p className='user'>{user.name}</p>
                                <p className='email'>{user.email}</p>
                            </div>
                            <div className="menu-option">
                                <a className='setting-btn' href="#">
                                    <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="#70A9E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M12.9046 3.06005C12.6988 3 12.4659 3 12 3C11.5341 3 11.3012 3 11.0954 3.06005C10.7942 3.14794 10.5281 3.32808 10.3346 3.57511C10.2024 3.74388 10.1159 3.96016 9.94291 4.39272C9.69419 5.01452 9.00393 5.33471 8.36857 5.123L7.79779 4.93281C7.3929 4.79785 7.19045 4.73036 6.99196 4.7188C6.70039 4.70181 6.4102 4.77032 6.15701 4.9159C5.98465 5.01501 5.83376 5.16591 5.53197 5.4677C5.21122 5.78845 5.05084 5.94882 4.94896 6.13189C4.79927 6.40084 4.73595 6.70934 4.76759 7.01551C4.78912 7.2239 4.87335 7.43449 5.04182 7.85566C5.30565 8.51523 5.05184 9.26878 4.44272 9.63433L4.16521 9.80087C3.74031 10.0558 3.52786 10.1833 3.37354 10.3588C3.23698 10.5141 3.13401 10.696 3.07109 10.893C3 11.1156 3 11.3658 3 11.8663C3 12.4589 3 12.7551 3.09462 13.0088C3.17823 13.2329 3.31422 13.4337 3.49124 13.5946C3.69158 13.7766 3.96395 13.8856 4.50866 14.1035C5.06534 14.3261 5.35196 14.9441 5.16236 15.5129L4.94721 16.1584C4.79819 16.6054 4.72367 16.829 4.7169 17.0486C4.70875 17.3127 4.77049 17.5742 4.89587 17.8067C5.00015 18.0002 5.16678 18.1668 5.5 18.5C5.83323 18.8332 5.99985 18.9998 6.19325 19.1041C6.4258 19.2295 6.68733 19.2913 6.9514 19.2831C7.17102 19.2763 7.39456 19.2018 7.84164 19.0528L8.36862 18.8771C9.00393 18.6654 9.6942 18.9855 9.94291 19.6073C10.1159 20.0398 10.2024 20.2561 10.3346 20.4249C10.5281 20.6719 10.7942 20.8521 11.0954 20.94C11.3012 21 11.5341 21 12 21C12.4659 21 12.6988 21 12.9046 20.94C13.2058 20.8521 13.4719 20.6719 13.6654 20.4249C13.7976 20.2561 13.8841 20.0398 14.0571 19.6073C14.3058 18.9855 14.9961 18.6654 15.6313 18.8773L16.1579 19.0529C16.605 19.2019 16.8286 19.2764 17.0482 19.2832C17.3123 19.2913 17.5738 19.2296 17.8063 19.1042C17.9997 18.9999 18.1664 18.8333 18.4996 18.5001C18.8328 18.1669 18.9994 18.0002 19.1037 17.8068C19.2291 17.5743 19.2908 17.3127 19.2827 17.0487C19.2759 16.8291 19.2014 16.6055 19.0524 16.1584L18.8374 15.5134C18.6477 14.9444 18.9344 14.3262 19.4913 14.1035C20.036 13.8856 20.3084 13.7766 20.5088 13.5946C20.6858 13.4337 20.8218 13.2329 20.9054 13.0088C21 12.7551 21 12.4589 21 11.8663C21 11.3658 21 11.1156 20.9289 10.893C20.866 10.696 20.763 10.5141 20.6265 10.3588C20.4721 10.1833 20.2597 10.0558 19.8348 9.80087L19.5569 9.63416C18.9478 9.26867 18.6939 8.51514 18.9578 7.85558C19.1262 7.43443 19.2105 7.22383 19.232 7.01543C19.2636 6.70926 19.2003 6.40077 19.0506 6.13181C18.9487 5.94875 18.7884 5.78837 18.4676 5.46762C18.1658 5.16584 18.0149 5.01494 17.8426 4.91583C17.5894 4.77024 17.2992 4.70174 17.0076 4.71872C16.8091 4.73029 16.6067 4.79777 16.2018 4.93273L15.6314 5.12287C14.9961 5.33464 14.3058 5.0145 14.0571 4.39272C13.8841 3.96016 13.7976 3.74388 13.6654 3.57511C13.4719 3.32808 13.2058 3.14794 12.9046 3.06005Z" stroke="#70A9E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                                    <p>Настройки</p>
                                </a>
                                <a className='help-btn' href="#" target="_blank" rel="noreferrer">
                                    <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.1" d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" fill="#70a9e9"></path> <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#70a9e9" strokeWidth="2"></path> <path d="M10.5 8.67709C10.8665 8.26188 11.4027 8 12 8C13.1046 8 14 8.89543 14 10C14 10.9337 13.3601 11.718 12.4949 11.9383C12.2273 12.0064 12 12.2239 12 12.5V12.5V13" stroke="#70a9e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M12 16H12.01" stroke="#70a9e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                                    <button>Помощь</button>
                                </a>
                                <a className='topic-btn' href="#">
                                    <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 10.5C8 11.3284 7.32843 12 6.5 12C5.67157 12 5 11.3284 5 10.5C5 9.67157 5.67157 9 6.5 9C7.32843 9 8 9.67157 8 10.5Z" fill="#70A9E9"></path> <path d="M10.5 8C11.3284 8 12 7.32843 12 6.5C12 5.67157 11.3284 5 10.5 5C9.67157 5 9 5.67157 9 6.5C9 7.32843 9.67157 8 10.5 8Z" fill="#70A9E9"></path> <path d="M17 6.5C17 7.32843 16.3284 8 15.5 8C14.6716 8 14 7.32843 14 6.5C14 5.67157 14.6716 5 15.5 5C16.3284 5 17 5.67157 17 6.5Z" fill="#70A9E9"></path> <path d="M7.5 17C8.32843 17 9 16.3284 9 15.5C9 14.6716 8.32843 14 7.5 14C6.67157 14 6 14.6716 6 15.5C6 16.3284 6.67157 17 7.5 17Z" fill="#70A9E9"></path> <path fillRule="evenodd" clipRule="evenodd" d="M1 12C1 5.92487 5.92487 1 12 1C17.9712 1 23 5.34921 23 11V11.0146C23 11.543 23.0001 12.4458 22.6825 13.4987C21.8502 16.2575 18.8203 16.9964 16.4948 16.4024C16.011 16.2788 15.5243 16.145 15.0568 16.0107C14.2512 15.7791 13.5177 16.4897 13.6661 17.2315L13.9837 18.8197L14.0983 19.5068C14.3953 21.289 13.0019 23.1015 11.0165 22.8498C7.65019 22.423 5.11981 21.1007 3.43595 19.1329C1.75722 17.171 1 14.6613 1 12ZM12 3C7.02944 3 3 7.02944 3 12C3 14.2854 3.64673 16.303 4.95555 17.8326C6.25924 19.3561 8.3 20.4894 11.2681 20.8657C11.7347 20.9249 12.2348 20.4915 12.1255 19.8356L12.0163 19.1803L11.7049 17.6237C11.2467 15.3325 13.4423 13.4657 15.6093 14.0885C16.0619 14.2186 16.529 14.3469 16.9897 14.4646C18.7757 14.9208 20.3744 14.2249 20.7677 12.921C20.997 12.161 21 11.5059 21 11C21 6.65079 17.0745 3 12 3Z" fill="#70A9E9"></path> </g></svg>
                                    <button>Тема</button>
                                </a>
                                <button className='exit-btn' onClick={handleLogout}>
                                    <svg width="64px" height="64px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000">
                                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                        <g id="SVGRepo_iconCarrier">
                                            <title>entrance_fill</title>
                                            <g id="页面-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                <g id="System" transform="translate(-672.000000, -144.000000)" fillRule="nonzero">
                                                    <g id="entrance_fill" transform="translate(672.000000, 144.000000)">
                                                        <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" id="MingCute" fillRule="nonzero"></path>
                                                        <path d="M12,2.5 C12.8284,2.5 13.5,3.17157 13.5,4 C13.5,4.82843 12.8284,5.5 12,5.5 L12,5.5 L7,5.5 C6.72386,5.5 6.5,5.72386 6.5,6 L6.5,6 L6.5,18 C6.5,18.2761 6.72386,18.5 7,18.5 L7,18.5 L11.5,18.5 C12.3284,18.5 13,19.1716 13,20 C13,20.8284 12.3284,21.5 11.5,21.5 L11.5,21.5 L7,21.5 C5.067,21.5 3.5,19.933 3.5,18 L3.5,18 L3.5,6 C3.5,4.067 5.067,2.5 7,2.5 L7,2.5 Z M18.0606,8.11091 L20.889,10.9393 C21.4748,11.5251 21.4748,12.4749 20.889,13.0607 L18.0606,15.8891 C17.4748,16.4749 16.5251,16.4749 15.9393,15.8891 C15.3535,15.3033 15.3535,14.3536 15.9393,13.7678 L16.207,13.5 L12,13.5 C11.1716,13.5 10.5,12.8284 10.5,12 C10.5,11.1716 11.1716,10.5 12,10.5 L16.207,10.5 L15.9393,10.2322 C15.3535,9.64645 15.3535,8.6967 15.9393,8.11091 C16.5251,7.52513 17.4748,7.52513 18.0606,8.11091 Z" id="形状结合" fill="#70A9E9"></path>
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </svg>
                                    <p>Выйти</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </header>
    )
}

export default Header
