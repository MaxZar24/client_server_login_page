import './Login.css';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';

function Login() {

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = {
            email: event.target.email.value,
            password: event.target.password.value,
        };

        try {
            const response = await axios.post('/login', formData);

            if (response.status === 200) {
                console.log(response.data.message);
                const userData = response.data.user;
                localStorage.setItem('user', JSON.stringify(userData));
                navigate('/home');
            }

        } catch (error) {
            if (error.response && error.response.status === 400) {
                const falseEmail = document.getElementById("email-input")
                const falsePassword = document.getElementById("password-input")
                falseEmail.style.border = "2px solid red"
                falsePassword.style.border = "2px solid red"
                falseEmail.value = ""
                falsePassword.value = ""
                falseEmail.placeholder = `Incorrect login or password.`
                falsePassword.placeholder = `Incorrect login or password.`
            }
        }
    };

    return (
        <div className="Login">
            <main>
                <h1>Log In</h1>
                <form onSubmit={handleSubmit}>
                    <label>Email: </label>
                    <input name="email" type="email" id="email-input" required placeholder="Enter your email.."></input>
                    <label>Password: </label>
                    <input name="password" type="password" id="password-input" required placeholder="Enter your password.."></input>
                    <div className="buttons">
                        <button>Login</button>
                        <Link to="/">Don`t have an account?</Link>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default Login;
