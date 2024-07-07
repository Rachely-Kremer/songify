import axios from "axios";
import {useState } from "react";


const UseGet = () => {
    const [res, setRes] = useState<any>(null);

    const get = async (url:string) => {
        try {
            const response = await axios.get(url);
            setRes(response.data);
        }
        catch (error) {
            console.log(error);
            throw error; // Optionally, rethrow the error to handle in async thunks
        }
    }
    return[get,res];
}
export default UseGet;