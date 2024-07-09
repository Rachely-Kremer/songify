import axios from "axios";

const UsePut = () => {

    const put = async (url: string, data: any) => {
        try {
            await axios.put(url, data);
        }
        catch (error) {
            console.error(error);
            throw error; // Optionally, rethrow the error to handle in async thunks
        }
    }
    return put;
}
export default UsePut;