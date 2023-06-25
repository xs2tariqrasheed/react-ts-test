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
import { Col, Row } from "../../components/Layout";
import useStyles from "./style";

const PREFECTURES_API = process.env.REACT_APP_PREFECTURES_API || "";
const POPULATION_COMPOSITION_API =
  process.env.REACT_APP_POPULATION_COMPOSITION_API;

const populationTypes = ["総人口", "年少人口", "生産年齢人口", "老年人口"];

const Prefectures = () => {
  const [prefList, setPrefList] = useState<Prefecture[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [prefStatType, setPrefStatType] = useState<StatType>("総人口");

  const classes = useStyles();

  useEffect(() => {
    const fetchPrefectureList = async () => {
      setLoading(true);
      try {
        const res = await axios.get(PREFECTURES_API);
        setPrefList(res.data.result);

        // Fetch population composition for first prefecture, to show line graph
        await fetchPopulationComposition(1);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPrefectureList();
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

      /*
      Note: there're many ways to set state and manage state, for this scenario.
      The following is not the best, for best practice we can use Emmer or useReducer hook to simplify code.
      I believe for this test/assignment it's fine as it's not going to be in production. 
      */
      // Set population composition state for the given prefCode
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
      /*
      Note: there're many ways to set state and manage state, for this scenario.
      The following is not the best, for best practice we can use Emmer or useReducer hook to simplify code.
      I believe for this test/assignment it's fine as it's not going to be in production. 
      */
      // Remove the composition for unchecked pref from the state.
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
    <Spin spinning={loading}>
      <h3>Prefectures</h3>
      {/* Radio buttons section for selecting Population composition type */}
      <Row>
        {populationTypes.map((item) => (
          <Col span={2} sm={6} key={item}>
            <RadioButton
              label={item}
              value={item}
              checked={prefStatType === item}
              onChange={handleRadioChange}
              key={item}
            />
          </Col>
        ))}
      </Row>

      {/* Graph component section */}
      <div className={classes.graphWrapper}>
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
      </div>

      {/* Pref selection section */}
      <Row>
        {prefList.map((pref: Prefecture) => (
          <Col span={1} sm={4} key={pref.prefCode}>
            <CheckBox
              color={pref.stroke}
              label={pref.prefName}
              checked={!!pref.selected}
              onChange={(checked) => onSelectPref(checked, pref)}
            />
          </Col>
        ))}
      </Row>
    </Spin>
  );
};
export default Prefectures;
