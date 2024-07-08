import { axiosInstance } from "../constants/axiosInstance";
import { setFlag } from "../redux/slices/AllSlice";

interface NewData {
  id: number;
  name: string;
  description: string[];
  date: string;
}

const PutRequest = async (newData: NewData, dispatch: any) => {
  try {
    const response = await axiosInstance.put(`/${newData.id}`, newData);
    if (response.status === 200) {
      dispatch(setFlag());
    }
  } catch (error) {
    console.log("Put request error", error);
  }
};

export default PutRequest;
