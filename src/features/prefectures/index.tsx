import React, { useEffect, useState } from "react";
import axios from "axios";
interface Prefecture {
  prefCode: number;
  prefName: string;
}

const Prefectures = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [populationData, setPopulationData] = useState<any[]>([]);

  const [selectedPref, setSelectedPref] = useState<Prefecture[]>([]);

  const BASE_URL = process.env.REACT_APP_BASE_URL || "";
  const ALL_PREFECTURES_API = process.env.REACT_APP_ALL_PREFECTURES_API;
  const POPULATION_COMPOSITION_API =
    process.env.REACT_APP_POPULATION_COMPOSITION_API;
  const API_KEY = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    setIsFetching(true);
    axios
      .get(BASE_URL + ALL_PREFECTURES_API, {
        headers: {
          "X-API-KEY": API_KEY,
        },
      })
      .then((res) => {
        setData(res?.data?.result);
        setIsFetching(false);
      })
      .catch((error) => {
        setIsFetching(false);
        console.log("error in fetching prefectures", error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPopulationComposition = (prefCode: number) => {
    setLoading(true);
    axios
      .get(
        BASE_URL +
          POPULATION_COMPOSITION_API +
          `?prefCode=${prefCode}&cityCode=-`,
        {
          headers: {
            "X-API-KEY": API_KEY,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        const compositions = res?.data?.result?.data;

        // filtered compositions
        let filteredCompositions = [] as any;
        compositions.forEach((item: any) => {
          const value = {} as any;
          value[item?.label] = item.data;
          filteredCompositions?.push(value);
        });

        // new modified array
        let newData = {
          prefCode: prefCode,
          data: filteredCompositions,
        };
        setPopulationData([...populationData, newData]);
      })
      .catch((error) => {
        setLoading(false);
        console.log("error in fetching prefectures", error);
      });
  };

  const handleCheckboxChange = (prefecture: Prefecture) => {
    if (
      populationData.find((item) => item.prefCode === prefecture?.prefCode) !==
      undefined
    ) {
      setPopulationData(
        populationData.filter((pref) => pref?.prefCode !== prefecture.prefCode)
      );
    } else {
      fetchPopulationComposition(prefecture?.prefCode);
    }
    if (selectedPref.includes(prefecture)) {
      setSelectedPref(selectedPref.filter((pref) => pref !== prefecture));
    } else {
      setSelectedPref([...selectedPref, prefecture]);
    }
  };

  return (
    <div style={{ padding: 50 }}>
      {loading || isFetching ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>Prefecture List</h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            {data.map((prefecture) => (
              <div key={prefecture.prefCode}>
                <input
                  disabled={loading}
                  type="checkbox"
                  checked={selectedPref.includes(prefecture)}
                  onChange={() => handleCheckboxChange(prefecture)}
                />
                <span>{prefecture.prefName}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <pre>{JSON.stringify(populationData, null, 2)}</pre>
    </div>
  );
};

export default Prefectures;
