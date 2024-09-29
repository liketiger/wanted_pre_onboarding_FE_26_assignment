import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import { getMockData } from "./api";
import { MockData } from "./type";

function App() {
  const [list, setList] = useState<MockData[]>([]);
  const [currPage, setCurrPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNoMore, setHasNoMore] = useState(false);
  const [totlaAmount, setTotalAmount] = useState(0);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const getNextItems = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    const { datas, isEnd } = (await getMockData(currPage)) as {
      datas: MockData[];
      isEnd: boolean;
    };

    setList((prev) => [...prev, ...datas]);
    setIsLoading(false);

    if (isEnd) {
      setHasNoMore(true);
    } else {
      setCurrPage((prev) => prev + 1);
    }
  }, [isLoading, currPage]);

  useEffect(() => {
    if (!loaderRef.current || hasNoMore) return;

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        getNextItems();
      }
    });

    observerRef.current.observe(loaderRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [getNextItems, hasNoMore]);

  useEffect(() => {
    const newAmount = list.reduce((acc, curr) => acc + curr.price, 0);
    setTotalAmount(newAmount);
  }, [list]);

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          margin: "0 auto",
          width: "500px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Products</h1>
          <p>합계 : {totlaAmount}</p>
        </div>
        <ul
          style={{
            listStyle: "none",
            padding: "0",
            margin: "0",
            width: "500px",
            height: "500px",
            overflow: "auto",
          }}
        >
          {list.map((item) => {
            return (
              <li
                style={{
                  padding: "10px",
                  border: "1px solid black",
                  marginBottom: "2px",
                }}
                key={item.productId}
              >
                <p>{item.productName}</p>
                <p>{item.boughtDate}</p>
                <p>{item.price}</p>
              </li>
            );
          })}
          <div
            ref={loaderRef}
            style={{ height: "20px", backgroundColor: "transparent" }}
          />
          {hasNoMore && <p>더 이상 데이터가 없습니다.</p>}
        </ul>
        {isLoading && (
          <div style={{ textAlign: "center" }}>
            <span className="loader" />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
