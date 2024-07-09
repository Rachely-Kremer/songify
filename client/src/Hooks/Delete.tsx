import axios from 'axios';

const UseDelete = () => {
    const Delete = async (url:string) => {
        try {
            await axios.delete(url);
        }catch (error){
            console.error(error);
            throw error; // Optionally, rethrow the error to handle in async thunks
        }
    }
    return Delete;
}
export default UseDelete;