import { useQuery } from '@apollo/client';
import { ILDOItem } from '@/types';
import { GET_LDOS } from '@/graphql/director';
import Loader from '../elements/Loader';
import { AdvancedImage } from '@cloudinary/react';
import cld from '@/config/cloudinary.config';

/**
 * React component that represent a list of directors
 */
function DirectorList() {
    const { data, loading, error } = useQuery(GET_LDOS);
    console.log(data);


    if (loading) return <Loader />;
    if (error) return <p className="text-red-700">Something went wrong!</p>;

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
                        {data?.getLeagueDirectors?.data?.map((ldo: ILDOItem, i: number) => (
                            <tr key={i}>
                                <td className="py-2 px-4 capitalize" >{ldo.name}</td>
                                <td className="py-2 px-4 capitalize" >
                                    {ldo?.logo ? <AdvancedImage className="w-8" cldImg={cld.image(ldo?.logo)} /> : '' }
                                </td>
                                <td className="py-2 px-4 capitalize" >{ldo.director?.firstName} {ldo.director?.lastName}</td>
                                <td className="py-2 px-4 lowercase" >{ldo.director?.login?.email}</td>
                                <td className="py-2 px-4 capitalize" >
                                    <button>Edit</button>
                                    <button>delete</button>
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