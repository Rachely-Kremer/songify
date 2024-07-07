import axios from "axios";

const UsePost = () => {
    const post = async (url:string, data:any) => {
        try {
            console.log(data);
            await axios.post(url, data); 
        }
        catch (error) {
            console.error(error);
            throw error; // Optionally, rethrow the error to handle in async thunks
        }
    }
    return post;
}
export default UsePost;