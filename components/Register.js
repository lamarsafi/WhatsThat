import React, {useState} from 'react';



export const Register = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');
    

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    }

    return(
        <>
        <div className='signup-form-container'>
        <form onSubmit={handleSubmit}>
            <label for='name'>name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} type='text' placeholder='Full Name' id='name' name='name' />
            <label for='email'>email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type='email' placeholder='youremail@gmail.com' id='email' name='email' />
            <label for='password'>password</label>
            <input value={pass} onChange={(e) => setPass(e.target.value)} type='password' placeholder='*******' id='password' name='password' />
            <button type='submit'>Sign Up</button>
            <button onClick={() => props.onFormSwitch('login')}>Already Registered? Log In here!</button>
        </form>
        
        </div>
       
        </>
       
    )
}