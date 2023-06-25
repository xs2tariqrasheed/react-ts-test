import { ChangeEvent, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { Spin } from "../../components/Spin";
import RadioButton from "../../components/RadioButton";
import CheckBox from "../../components/Checkbox";
import strokeColors from "./strokeColors";
import { Prefecture, StatType } from "./types";
import getGraphData from "./getGraphData";

const populationTypes = ["総人口", "年少人口", "生産年齢人口", "老年人口"];

const Prefectures = () => {
  const [prefList, setPrefList] = useState<Prefecture[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [prefStatType, setPrefStatType] = useState<StatType>("総人口");

  const PREFECTURES_API = process.env.REACT_APP_PREFECTURES_API || "";
  const POPULATION_COMPOSITION_API =
    process.env.REACT_APP_POPULATION_COMPOSITION_API;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(PREFECTURES_API);
        setPrefList(res.data.result);
        await fetchPopulationComposition(1);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const fetchPopulationComposition = async (prefCode: number) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${POPULATION_COMPOSITION_API}?prefCode=${prefCode}&cityCode=-`
      );
      const composition = res?.data?.result?.data.reduce(
        (acc: any, item: any) => {
          acc[item?.label] = item.data;
          return acc;
        },
        {}
      );
      setPrefList((prevPrefList: Prefecture[]) =>
        prevPrefList.map((p, i) =>
          p.prefCode === prefCode
            ? { ...p, selected: true, composition, stroke: strokeColors[i] }
            : p
        )
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const onSelectPref = (selected: boolean, prefecture: Prefecture) => {
    if (selected) {
      fetchPopulationComposition(prefecture.prefCode);
    } else {
      // remove
      setPrefList(
        prefList.map((p) =>
          p.prefCode === prefecture.prefCode
            ? { ...p, selected: false, composition: null, stroke: undefined }
            : p
        )
      );
    }
  };

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrefStatType(e.target.value as StatType);
  };

  const graphData = getGraphData(prefList, prefStatType);

  return (
    <div style={{ padding: 50 }}>
      <Spin spinning={loading}>
        <div>
          <h2>Prefecture List</h2>
          {/* TODO: fix the inline style */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            {prefList.map((pref: Prefecture) => (
              // TODO: Fix the inline style
              <div key={pref.prefCode} style={{ width: 90 }}>
                <CheckBox
                  color={pref.stroke}
                  label={pref.prefName}
                  checked={!!pref.selected}
                  onChange={(checked) => onSelectPref(checked, pref)}
                />
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "start",
            justifyContent: "space-between",
            marginTop: 30,
          }}
        >
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              {Object.keys(graphData?.[0] || {})
                .filter((k: string) => k !== "year" && k !== "stroke")
                .map((key, index) => (
                  <Line
                    type="monotone"
                    dataKey={key}
                    key={key}
                    stroke={graphData?.[index]?.stroke}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
          {/* TODO: fix inline style */}
          <div
            style={{
              marginRight: 10,
              width: 300,
              paddingLeft: 30,
            }}
          >
            <h3>Population Composition</h3>
            <div>
              {populationTypes.map((item, index) => (
                <div key={index} style={{ marginTop: index === 0 ? 0 : 20 }}>
                  <RadioButton
                    label={item}
                    value={item}
                    checked={prefStatType === item}
                    onChange={handleRadioChange}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Spin>
    </div>
  );
};
export default Prefectures;
