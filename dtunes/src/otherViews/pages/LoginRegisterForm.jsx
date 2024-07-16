import { useContext, useState } from "react";
import InputBox from "../components/InputBox";
import SubmitButton from '../components/SubmitButton'
import { toast } from "react-toastify";
import axios from "axios";
import LoginNavbar from "../components/LoginNavbar";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";


export default function LoginRegisterForm({ backendUrl, activated }) {
    const navigate = useNavigate();

    let isArtist = activated[4];
    let newUser = activated[5];

    let pageHeading = 'Login & Registration'
    if (activated[0]) pageHeading = 'User Registration';
    else if (activated[1]) pageHeading = 'User Login';
    else if (activated[2]) pageHeading = 'Artist Registration';
    else if (activated[3]) pageHeading = 'Artist Login';

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    // let name, setName, profileColor, setProfileColor;
    const [name, setName] = useState('')
    const [profileColor, setProfileColor] = useState('#a855f7')

    function validate() {
        if (!username) {
            toast.warn('Username can\'t be blank!')
            return false;
        }
        if (username.length < 4) {
            toast.warn('Username should be atleast 4 characters!')
            return false;
        }

        if (!password) {
            toast.warn('Password can\'t be blank!')
            return false;
        }
        if (password.length < 6) {
            toast.warn('Password should be atleast 6 characters!')
            return false;
        }

        if (!name && newUser) {
            toast.warn('Name can\'t be blank!')
            return false;
        }

        return true;

    }

    function resetForm() {
        setUsername('');
        setPassword('');

        if (newUser) {
            setName('');
            setProfileColor('#a855f7');
        }
    }

    async function submitHandler(e) {
        e.preventDefault();
        if (!validate()) return;

        let formData;
        if (newUser) {
            formData = {
                username,
                password,
                name,
                profileColor,
                isArtist
            }
        }
        else {
            formData = {
                username,
                password,
                isArtist
            }

        }

        if (newUser) {
            try {

                const response = await axios.post(`${backendUrl}/api/users`, formData);
                if (response.data.success) {
                    toast.success('Your account is now created!');
                    resetForm();
                    console.log(response);
                    localStorage.setItem('dtunesStorage', JSON.stringify({ loggedIn: true, user: response.data.user }))
                    navigate('/');
                }
                else {
                    if (response.data.errorCode === 'usernameDuplicate') {
                        return toast.warn(`Entered username: ${username} is already taken!`);
                    }
                    toast.warn('Issue in your form. Try again!');
                }

            } catch (err) {
                console.log(err);
                toast.error('Some error occured! Try again!')
            }
        }

        else {
            try {

                const response = await axios.post(`${backendUrl}/api/users/login`, formData);
                if (response.data.success) {
                    toast.success('Successfully logged in!');
                    resetForm();

                    localStorage.setItem('dtunesStorage', JSON.stringify({ loggedIn: true, user: response.data.user }))
                    navigate('/');
                }
                else {
                    if (response.data.errorCode === 'usernameNotExist') {
                        toast.warn('Username does not exist!');
                    }
                    else if (response.data.errorCode === 'invalidCredentials') {
                        toast.warn('Invalid Credentials');
                    }
                    else {
                        toast.warn('Some error occured. Try again!');
                        console.log(response);
                    }
                }
            } catch (err) {
                toast.error('Some error occured, try again later');
                console.log(response, err);
            }
        }
    }

    return (
        <>
            <Navbar pageHeading={pageHeading} />
            <form onSubmit={submitHandler} className="flex flex-col items-start gap-8 text-gray-600" action="">

                <InputBox onChangeSet={setUsername} value={username} placeholder="Enter username" inputType="text" label='Enter Username:' />
                <InputBox onChangeSet={setPassword} value={password} placeholder="Enter password" inputType="password" label='Enter password:' />
                {newUser && <InputBox onChangeSet={setName} value={name} placeholder="Enter name" inputType="text" label='Enter Name:' />}
                {newUser && <InputBox onChangeSet={setProfileColor} value={profileColor} inputType="color" label='Choose Profile Color:' />}
                <SubmitButton text={activated[1] || activated[3] ? 'Login' : 'Submit'} />
            </form>
        </>
    )
}