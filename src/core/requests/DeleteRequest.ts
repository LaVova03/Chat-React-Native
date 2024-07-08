import { axiosInstance } from "../constants/axiosInstance";

const DeleteRequest = async (id: number, setFlag: any, dispatch: any) => {
  try {
    const response = await axiosInstance.delete(`/${id}`);
    if (response.status === 200) {
      dispatch(setFlag());
      alert("Chat deleted");
    }
  } catch (error) {
    console.log("Get request error", error);
  }
};

export default DeleteRequest;
