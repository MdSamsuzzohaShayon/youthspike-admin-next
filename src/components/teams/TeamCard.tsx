import React from 'react';

function TeamCard() {
    return (
        <div className="team-card w-full p-2 bg-gray-700 rounded-lg flex items-start justify-between">
            <div className="w-1/12">
                <input type="checkbox" name="select-item" id="league-item" />
            </div>
            <div className="w-5/12">
                <div className="brand flex gap-1 items-center">
                    <img src="/free-logo.svg" alt="free-logo" className="w-12" />
                    <h3 className='leading-none text-lg font-bold'>Phoenix Arizoena</h3>
                </div>
                <p>2-1 Record</p>
            </div>
            <div className="w-5/12">
                <div className="brand flex gap-1">
                    <img src="/free-logo.svg" alt="free-logo" className="w-12 h-12 rounded-full border-2 border-yellow-500" />
                    <div className="caption flex flex-col">
                        <p className='uppercase text-xs'>Captain</p>
                        <h3 className='leading-none text-lg font-bold'>Phoenix Arizoena</h3>
                    </div>
                </div>
                <p className='flex'><span><img src="/icons/telephone.svg" alt="telephone" className='w-6 svg-white' /></span>222-222-2222</p>
                <p className='flex gap-1'>Active players <span className='flex items-center justify-center w-6 h-6 rounded-full bg-gray-900'>7</span></p>
            </div>
            <div className="w-1/12">
                <img src="/icons/dots-vertical.svg" alt="dots-vertical" className="w-6 svg-white" />
            </div>
        </div>
    )
}

export default TeamCard;