import { axiosInstance } from "../constants/axiosInstance";

type SetDataFunction = (data: any) => void;

const GetRequest = async ({ setData }: { setData: SetDataFunction }) => {
  try {
    const response = await axiosInstance.get("/");
    if (response.status === 200) {
      setData(response.data);
    }
  } catch (error) {
    console.log("Get request error", error);
  }
};

export default GetRequest;
