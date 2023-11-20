import { ILDOItem } from '@/types';
import { AdvancedImage } from '@cloudinary/react';
import cld from '@/config/cloudinary.config';
import { useRouter } from 'next/navigation';

/**
 * React component that represent a list of directors
 */
function DirectorList({ ldoList }: { ldoList: ILDOItem[] }) {
    const router = useRouter();

    const handleEditLDO = (e: React.SyntheticEvent, ldoId: string): void => {
        e.preventDefault();
        router.push(`/admin/directors/${ldoId}`);
        
    }

    const handleDeleteLDO = (e: React.SyntheticEvent, ldoId: string): void => {
        e.preventDefault();
    }

    return (
        <div>
            <h2>Direstor List</h2>
            <div className="overflow-x-auto">
                <table className="w-full bg-transparent border shadow">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 capitalize" >Name</th>
                            <th className="py-2 px-4 capitalize" >Logo</th>
                            <th className="py-2 px-4 capitalize" >Director</th>
                            <th className="py-2 px-4 capitalize" >Director Email</th>
                            <th className="py-2 px-4 capitalize" >Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ldoList?.map((ldo: ILDOItem, i: number) => (
                            <tr key={i}>
                                <td className="py-2 px-4 capitalize" >{ldo.name}</td>
                                <td className="py-2 px-4 capitalize" >
                                    {ldo?.logo ? <AdvancedImage className="w-8" cldImg={cld.image(ldo?.logo)} /> : ''}
                                </td>
                                <td className="py-2 px-4 capitalize" >{ldo.director?.firstName} {ldo.director?.lastName}</td>
                                <td className="py-2 px-4 lowercase" >{ldo.director?.login?.email}</td>
                                <td className="py-2 px-4 capitalize flex justify-center items-center gap-2" >
                                    <button onClick={(e) => handleEditLDO(e, ldo?._id)}>
                                        <img src='/icons/edit.svg' alt='edit' className='w-6 svg-white' />
                                    </button>
                                    <button onClick={(e) => handleDeleteLDO(e, ldo?._id)} >
                                        <img src='/icons/delete.svg' alt='delete' className='w-6 svg-white' />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


export default DirectorList;