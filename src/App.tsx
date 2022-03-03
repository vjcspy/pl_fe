import {useCallback, useEffect, useState} from 'react'
import logo from './logo.svg'
import './App.css'

const alreadyToken: any[string] = [];
const ver = '0.0.5';
function App() {
    const [cpData,setCpData] = useState({
        cp: '',
        state: 0
    })
    const [loading, setLoading] = useState(false);
    const [beRes, setBeRes] = useState('');
    const [mess, setMess] = useState('');

    const addCp = useCallback((cp) => {
        const newCp = {state: cpData.state,cp};
        if(newCp.state === 0){
            setMess('Chuẩn bị send form 1');
        }else{
            setMess('Chuẩn bị send form 2');
        }
        console.log('Lưu cpData',newCp);
        setCpData(newCp)

    }, [cpData])

    useEffect(() => {
        console.log('run effect send form', cpData);
        const _do = async (_data:any)=>{
            if(_data.cp === '' || alreadyToken.includes(_data.cp)){
                console.log('khong chay do bi trung');
                return;
            }
            if (_data.state === 0) {
                console.log('chay send form 1');
                alreadyToken.push(_data.cp);
                const data = await fetch(`https://plbe.vm.test/sendform1?token=${_data.cp}`);
                setCpData({cp: '',state: 1})
                setBeRes(await data.text());
                setMess('Send form 1 ok');
            } else {
                console.log('chay send form 2');
                alreadyToken.push(_data.cp);
                const data = await fetch(`https://plbe.vm.test/sendform2?token=${_data.cp}`);
                setCpData({cp: '',state: 0})
                setBeRes(await data.text());
                setMess('Send form 2 ok');
            }
        }
        setTimeout((()=>{_do(cpData)}), 2000);

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
    }, [addCp]);

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
                    Version {ver}
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
