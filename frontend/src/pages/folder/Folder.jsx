import { useEffect, useState } from 'react';
import API from '../../services/api';
import { useParams } from 'react-router-dom';

const Folder = () => {
    const { folderId } = useParams();
    const [folder, setFolder] = useState(null);

    useEffect(() => {
        const fetchFolder = async () => {
            
                const response = await API.get(`/folders/${folderId}`);
                setFolder(response.data);
           
        };

        fetchFolder();
    }, [folderId]);


    return (
        <div>
            <h1>{folder?.name}</h1>
           
        </div>
    );
};

export default Folder;
