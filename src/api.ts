import { MOCK_DATA, PER_PAGE } from "./constants";
import { MockData } from "./type";

export const getMockData = (pageNum: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const datas: MockData[] = MOCK_DATA.slice(
          PER_PAGE * pageNum,
          PER_PAGE * (pageNum + 1)
        );
        const isEnd = PER_PAGE * (pageNum + 1) >= MOCK_DATA.length;
  
        resolve({ datas, isEnd });
      }, 1500);
    });
  };