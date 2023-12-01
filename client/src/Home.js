import React, {useState, useEffect} from 'react';
import './Home.css';

function Home() {
    const [newPassword, setNewPassword] = useState('');
    const [userData, setUserData] = useState(null);
    const [userList, setUserList] = useState([]);
    const [isFetchingUsers, setIsFetchingUsers] = useState(false);

    const storedUserData = localStorage.getItem('user');

    const fetchUsers = () => {
        setIsFetchingUsers(true);
        fetch('/get-users')
            .then(response => response.json())
            .then(data => setUserList(data.users))
            .catch(error => console.error('Error fetching users:', error))
            .finally(() => setIsFetchingUsers(false));
    };

    useEffect(() => {
        if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            setUserData(parsedUserData);

            if (parsedUserData.role === 1) {
                fetchUsers();
            }
        }
    }, [storedUserData]);

    const handleChangePassword = async () => {
        try {
            const response = await fetch('/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userData.email,
                    newPassword: newPassword,
                }),
            });

            if (response.ok) {
                const updatedUserData = await response.json();
                console.log('Password changed successfully!');
                setUserData(prevUserData => ({
                    ...prevUserData,
                    password: updatedUserData.newPassword,
                }));
            } else {
                console.error('Failed to change password.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleRoleChange = async (email, newRole) => {
        try {
            const response = await fetch('/change-role', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    newRole,
                }),
            });

            if (response.ok) {
                console.log('Role changed successfully!');
                fetchUsers();
            } else {
                console.error('Failed to change role.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDeleteUser = async (email) => {
        try {
            const response = await fetch('/delete-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                }),
            });

            if (response.ok) {
                console.log('User deleted successfully!');
                fetchUsers();
            } else {
                console.error('Failed to delete user.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="Home">
            <main>
                <h1>Welcome to your Homepage</h1>
                {userData && userData.role == 0 ? (
                    <div>
                        <p>Name: {userData.name}</p>
                        <p>Email: {userData.email}</p>
                        <p>Password: {userData.password}</p>
                        <p>Role: default</p>
                        <input
                            name="change-pass"
                            type="text"
                            id="change-pass"
                            placeholder="Change password.."
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                        />
                        <button type="button" onClick={handleChangePassword}>
                            Change
                        </button>
                    </div>
                ) : userData && userData.role == 1 ? (
                    <div className="admin-div">
                        <p>Name: {userData.name}</p>
                        <p>Email: {userData.email}</p>
                        <p>Password: {userData.password}</p>
                        <p>Role: admin</p>
                        <h2>Users List:</h2>
                        {isFetchingUsers ? (
                            <p>Loading users...</p>
                        ) : (
                            <div className={"table"}>
                                <button type="button" onClick={fetchUsers}>
                                    Fetch Users
                                </button>
                                <ul>
                                    {userList.map(user => (
                                        <li key={user.email}>
                                            Name: {user.name}, Email: {user.email}, Role: {user.role}
                                            <button
                                                className="li-butt"
                                                type="button"
                                                onClick={() => handleRoleChange(user.email, user.role === 1 ? 0 : 1)}
                                            >
                                                {user.role === 1 ? 'Make User' : 'Make Admin'}
                                            </button>
                                            <button
                                                className="li-butt"
                                                type="button"
                                                onClick={() => handleDeleteUser(user.email)}
                                            >
                                                Delete User
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ) : null}
            </main>
        </div>
    );
}

export default Home;
