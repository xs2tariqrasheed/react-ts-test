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
import { Spin } from "../../components/Spin";
import RadioButton from "../../components/RadioButton";
import CheckBox from "../../components/Checkbox";
interface Prefecture {
  prefCode: number;
  prefName: string;
}
const Prefectures = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState("total");
  const [value, setValue] = useState(2);
  const [isFetching, setIsFetching] = useState(false);
  const [populationData, setPopulationData] = useState<any[]>([]);
  const [selectedPref, setSelectedPref] = useState<Prefecture | null>(null);
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
        fetchPopulationComposition(1);
        setValue(2);
        setChecked("total");
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
        setPopulationData([newData]);
      })
      .catch((error) => {
        setLoading(false);
        console.log("error in fetching prefectures", error);
      });
  };
  const handleCheckboxChange = (prefecture: Prefecture) => {
    setValue(2);
    setChecked("total");
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

    if (selectedPref?.prefCode === prefecture?.prefCode) {
      setSelectedPref(null);
    } else {
      setSelectedPref(prefecture);
    }
  };

  useEffect(() => {
    if (checked === "total") {
      setValue(2);
    } else if (checked === "young") {
      setValue(0);
    } else if (checked === "working") {
      setValue(1);
    } else {
      setValue(3);
    }
  }, [checked]);

  // Converting data according to chart data
  const graphData: any =
    populationData.length > 0 &&
    populationData?.map((item) =>
      Object.values(item?.data).map((item: any) =>
        item?.map((item: any, index: any) => {
          return {
            name: item?.year,
            population: item?.value,
          };
        })
      )
    );
  // NOTE: Value state is to handle the population composition
  // 2 for Total, 0 for Young, 1 for Working and 3 for Elderly populations
  const graphChartData = graphData && graphData[0][value];

  const handleRadioChange = (value: any) => {
    setChecked(value);
  };

  useEffect(() => {
    if (data) {
      const value = [data[0]];
      setSelectedPref(value[0]);
    }
  }, [data]);

  return (
    <div style={{ padding: 50 }}>
      <Spin spinning={isFetching || loading}>
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
                <CheckBox
                  label={prefecture.prefName}
                  checked={selectedPref?.prefCode === prefecture.prefCode}
                  onChange={() => handleCheckboxChange(prefecture)}
                />
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "start",
          }}
        >
          {populationData?.length > 0 && (
            <LineChart
              style={{ marginLeft: 30, marginTop: 50 }}
              width={1100}
              height={400}
              data={graphChartData}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="population" stroke="#8884D8" />
            </LineChart>
          )}
          <div style={{ marginTop: 35, marginLeft: 35 }}>
            {populationData?.length > 0 && (
              <div>
                <h3>Population Composition</h3>
                <div>
                  {[
                    {
                      label: "Total Population",
                      value: "total",
                    },
                    {
                      label: "Young Population",
                      value: "young",
                    },
                    {
                      label: "Working Age Population",
                      value: "working",
                    },
                    {
                      label: "Elderly Population",
                      value: "elderly",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      style={{ marginTop: index === 0 ? 0 : 20 }}
                    >
                      <RadioButton
                        label={item?.label}
                        value={item.value}
                        checked={checked === item.value}
                        onChange={handleRadioChange}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Spin>
    </div>
  );
};
export default Prefectures;
