import { axiosInstance } from "../constants/axiosInstance";

const PostRequest = async (newChat: object, setFlag: any, dispatch: any) => {
  try {
    const response = await axiosInstance.post("/", newChat);
    if (response.status === 200 || response.status === 201) {
      dispatch(setFlag());
    }
  } catch (error) {
    console.log("Post request error", error);
  }
};

export default PostRequest;
