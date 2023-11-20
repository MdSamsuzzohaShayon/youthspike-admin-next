import { ILoginProps } from '@/types';
import EmailInput from '../elements/forms/EmailInput';
import PasswordInput from '../elements/forms/PasswordInput';


function Login({ handleLogin, email, setEmail, password, setPassword }: ILoginProps) {

    const handleSetEmail = (e: React.SyntheticEvent) => {
        e.preventDefault();
        const inputEl = e.target as HTMLInputElement;
        setEmail(inputEl.value);
    }
    const handleSetPassword = (e: React.SyntheticEvent) => {
        const inputEl = e.target as HTMLInputElement;
        setPassword(inputEl.value);
    }

    return (
        <div className='h-screen w-full flex'>
            <div className="w-full md:w-3/6">
                <div className='container mx-auto px-2 w-full h-full flex justify-center items-center flex-col gap-2'>
                    <h1 className="text-3xl text-center font-bold p-2">Login</h1>
                    <form onSubmit={handleLogin} className='w-full'>
                        <EmailInput name='email' vertical defaultValue={email} lblTxt='Email Address' handleInputChange={handleSetEmail} required />
                        <PasswordInput name='password' vertical defaultValue={password} lblTxt='Password' handleInputChange={handleSetPassword} required />

                        <button
                            className="rounded p-2 px-8 outline-none bg-slate-500 hover:bg-slate-500 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 text-white mt-4 font-bold transform transition duration-300 hover:scale-110"
                            type="submit"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
            <div className="md:w-3/6 hidden md:flex justify-center items-center relative">
                <h1 className='absolute z-10'> Login to access as admin to league director</h1>
                <div className="img-holder w-full absolute left-0 top-0">
                    <img src="/login-bg.jpg" alt="login bg" className='w-full h-screen object-cover object-center' />
                </div>
            </div>
        </div>
    );
}


export default Login;