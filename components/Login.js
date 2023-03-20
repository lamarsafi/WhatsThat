import React, {useState} from 'react';


export const Login = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    

    const handleSubmit = (e) => {
        e.preventDefault();

        let to_send = {
            userEmail: this.state.email,
            password: this.state.pass,
        };
        
        return fetch("", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(to_send)
        })
        .then((response) => {
            console.log("Account added")
            console.log(response)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    return(
        <>
        <div className='login-form-container'>
            <form onSubmit={handleSubmit}>
                <label for='email'>email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type='email' placeholder='youremail@gmail.com' id='email' name='email' />
                <label for='password'>password</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type='password' placeholder='*******' id='password' name='password' />
                <button type='submit'>Log In</button>
                <button onClick={() => props.onFormSwitch('register')}>Don't have an account? Sign up here!</button>
            </form>
            
        </div>
       
        </>
       
    )
}