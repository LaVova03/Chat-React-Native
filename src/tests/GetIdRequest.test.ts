import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import GetRequest from "../core/requests/GetRequest";

const axiosInstance = axios.create();

const mockAxios = new MockAdapter(axiosInstance);

describe("GetRequest", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it("fetches data successfully from API", async () => {
    const setDataMock = jest.fn();
    const responseData = [
      {
        id: "2",
        name: "Gena",
        date: "08.07.2024, 12:10:26",
        description: [
          "dcdcdc",
          "sdcdscdsc",
          "t54ttg",
          "svsdvd",
          "fsdfd",
          "dcdcd",
          "sdcdc",
        ],
      },
      {
        id: "3",
        name: "Luda",
        date: "08.07.2024, 12:08:01",
        description: ["dfvdfvf", "ывасвыс", "dcdcdc", ""],
      },
      {
        id: "4",
        name: "Ylia",
        date: "08.07.2024, 09:41:06",
        description: ["fsdfdsf", "dhfgh"],
      },
    ];

    mockAxios.onGet("/").reply(200, responseData);

    await GetRequest({ setData: setDataMock });

    expect(setDataMock).toHaveBeenCalledWith(responseData);
  });

  it("handles error when API request fails", async () => {
    const setDataMock = jest.fn();

    mockAxios.onGet("/").reply(500, { error: "Internal Server Error" });

    try {
      await GetRequest({ setData: setDataMock });
    } catch (error) {
      expect(setDataMock).not.toHaveBeenCalled(); 
      expect(error).toBeDefined();
    }
  });
});
