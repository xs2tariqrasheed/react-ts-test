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

  const ALL_PREFECTURES_API = process.env.REACT_APP_ALL_PREFECTURES_API || "";
  const POPULATION_COMPOSITION_API =
    process.env.REACT_APP_POPULATION_COMPOSITION_API;

  useEffect(() => {
    setIsFetching(true);
    axios
      .get(ALL_PREFECTURES_API)
      .then((res) => {
        setData(res?.data?.result);
        setIsFetching(false);
      })
      .catch((error) => {
        setIsFetching(false);
        console.log("error in fetching prefectures", error);
      });
  }, []);

  const fetchPopulationComposition = (prefCode: number) => {
    setLoading(true);
    axios
      .get(`population/composition/perYear?prefCode=${prefCode}&cityCode=-`)
      .then((res) => {
        setLoading(false);
        const compositions = res?.data?.result?.data;

        // filtered compositions
        const filteredCompositions = {} as any;
        compositions.forEach((item: any) => {
          filteredCompositions[item?.label] = item.data;
        });
        console.log(filteredCompositions);
        // new modified array
        const newData = {
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
      {(loading || isFetching) && <p>Loading...</p>}
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
      <pre>{JSON.stringify(populationData, null, 2)}</pre>
    </div>
  );
};

export default Prefectures;
