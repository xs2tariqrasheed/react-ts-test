import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
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

  // converting data in to graph acceptable data
  const graphData: any =
    populationData.length > 0 &&
    populationData?.map((item) =>
      Object.values(item?.data).map((item: any) =>
        item?.map((item: any, index: any) => {
          return {
            name: item?.year,
            uv: item?.value,
          };
        })
      )
    );

  const graphChartData = graphData && graphData[0][0];

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
      {/* <pre>{JSON.stringify(populationData, null, 2)}</pre> */}
      {populationData?.length > 0 && (
        <LineChart
          style={{ marginLeft: 30, marginTop: 50 }}
          width={1200}
          height={400}
          data={graphChartData}
        >
          <Line type="monotone" dataKey="uv" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
        </LineChart>
      )}
    </div>
  );
};

export default Prefectures;
