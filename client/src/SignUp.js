import './SignUp.css';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';

function SignUp() {

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = {
            name: event.target.name.value,
            email: event.target.email.value,
            password: event.target.password.value,
            role: event.target.role.checked ? 1 : 0,
        };

        try {
            const response = await axios.post('/signup', formData);

            if (response.status === 200) {
                console.log(response.data.message);
                navigate('/login');
            }

        } catch (error) {
            if (error.response && error.response.status === 400) {
                const falseEmail = document.getElementById("email-input")
                falseEmail.style.border = "2px solid red"
                falseEmail.value = ""
                falseEmail.placeholder = `Can\`t create new user! Email already used.`
            }
        }
    };


    return (
        <div className="SignUp">
            <main>
                <h1>Create Account</h1>
                <form onSubmit={handleSubmit}>
                    <label>Name: </label>
                    <input name="name" required placeholder="Enter your name.."/>
                    <label>Email: </label>
                    <input name="email" type="email" id="email-input" required placeholder="Enter your email.."/>
                    <label>Password: </label>
                    <input name="password" type="password" required placeholder="Enter your password.."/>
                    <div className="buttons">
                        <label>Admin permits</label>
                        <input type="checkbox" name="role"/>
                        <button type="submit">Register</button>
                        <Link to="/login">Already have an account?</Link>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default SignUp;
