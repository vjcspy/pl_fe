import {useCallback, useEffect, useState} from 'react'
import logo from './logo.svg'
import './App.css'

function App() {
    const [cpData,setCpData] = useState({
        cp: '',
        state: 0
    })
    const [loading, setLoading] = useState(false);
    const [beRes, setBeRes] = useState('');
    const [mess, setMess] = useState('');

    const addCp = useCallback((cp) => {
        setCpData({...cpData,cp})
    }, [])

    useEffect(() => {
        const _do = async ()=>{
            if (cpData.state === 0) {
                const data = await fetch(`https://plbe.vm.test/sendform1?token=${cpData.cp}`);
                setCpData({...cpData,state: 1})
                setBeRes(await data.text());
            } else {
                const data = await fetch(`https://plbe.vm.test/sendform2?token=${cpData.cp}`);
                setCpData({...cpData,state: 0})
                setBeRes(await data.text());
            }
        }
        _do();

    }, [cpData]);

    const genCap = useCallback(() => {
        if (window.hasOwnProperty('grecaptcha')) {
            // @ts-ignore
            window.grecaptcha.ready(function () {
                setLoading(true);
                // @ts-ignore
                window.grecaptcha.execute('6LdARqkeAAAAAH8_9xW2Y00IesqWxc6GwDrJGUEL', {action: 'submit'}).then(async (token) => {
                    setLoading(false);
                    addCp(token);
                }).catch((e: any) => {
                    setMess('Error: ' + e.toString());
                    setLoading(false);
                });
            });
        }
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>{mess}</p>
                <div>
                    <button type="button" onClick={() => genCap()}>
                        {!loading && <div className="token" style={{color: 'green'}}>
                            {cpData.cp}
                        </div>}
                    </button>
                    <pre/>
                    {!loading && <div className="token" style={{color: 'red'}}>
                        {beRes}
                    </div>}
                </div>
                <p>
                    Edit <code>App.tsx</code> and save to test HMR updates.
                </p>
                <p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                    {' | '}
                    <a
                        className="App-link"
                        href="https://vitejs.dev/guide/features.html"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Vite Docs
                    </a>
                </p>
            </header>
        </div>
    )
}

export default App
