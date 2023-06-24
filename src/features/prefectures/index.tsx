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
          data={populationData}
        >
          {populationData?.map((item: any, index: number) => (
            <React.Fragment key={index}>
              <Line
                type="monotone"
                dataKey="value"
                data={item?.data["総人口"].map((entry: any) => ({
                  year: entry.year,
                  value: entry.value,
                }))}
                name="総人口"
                stroke="#8884D8"
              />
              <Line
                type="monotone"
                dataKey="value"
                data={item?.data["年少人口"].map((entry: any) => ({
                  year: entry.year,
                  value: entry.value,
                }))}
                name="年少人口"
                stroke="#82CA9D"
              />
              <Line
                type="monotone"
                dataKey="value"
                data={item?.data["生産年齢人口"].map((entry: any) => ({
                  year: entry.year,
                  value: entry.value,
                }))}
                name="生産年齢人口"
                stroke="#FF7F50"
              />
              <Line
                type="monotone"
                dataKey="value"
                data={item?.data["老年人口"].map((entry: any) => ({
                  year: entry.year,
                  value: entry.value,
                }))}
                name="老年人口"
                stroke="#FFC658"
              />
            </React.Fragment>
          ))}
          <XAxis
            dataKey="year"
            ticks={populationData[0]?.data["総人口"].map(
              (entry: any) => entry.year
            )}
          />
          <YAxis />
          <Tooltip />
        </LineChart>
      )}
    </div>
  );
};
export default Prefectures;
