import { axiosInstance } from "../constants/axiosInstance";

type SetDataFunction = (data: any) => void;

const GetIdRequest = async ({
  setIdData,
  id,
}: {
  setIdData: SetDataFunction;
  id: number;
}) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    if (response.status === 200) {
      setIdData([response.data]);
    }
  } catch (error) {
    console.log("Get request error", error);
  }
};

export default GetIdRequest;
