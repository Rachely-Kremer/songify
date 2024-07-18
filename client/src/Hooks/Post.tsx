import axios from "axios";

const UsePost = () => {
    const post = async (url:string, data:any) => {
        try {
            console.log(data);
            const response = await axios.post(url, data);
            return response.data; // מחזיר את התגובה מהשרת
        }
        catch (error) {
            console.error(error);
            throw error; // Optionally, rethrow the error to handle in async thunks
        }
    }
    return post;
}
export default UsePost;