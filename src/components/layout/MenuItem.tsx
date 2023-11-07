interface IMenuItem{
    icon: string;
    text: string;
}

function MenuItem({ icon, text }: IMenuItem) {
    return (
        <li className='flex justify-start items-center text-2xl font-bold'>
            <span><img src={icon} alt={text} className='w-10 svg-white mr-6' /></span>
            {text}
        </li>
    );
}

export default MenuItem;