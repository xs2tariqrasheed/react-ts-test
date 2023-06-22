import React, { useEffect, useState } from "react";
import axios from "axios";
import { ALL_PREFECTURES_API, API_KEY, BASE_URL } from "../../constants";

interface Prefecture {
  prefCode: number;
  prefName: string;
}

const Prefectures = () => {
  useEffect(() => {
    axios
      .get(BASE_URL + ALL_PREFECTURES_API, {
        headers: {
          "X-API-KEY": API_KEY,
        },
      })
      .then((res) => {
        setData(res?.data?.result);
      })
      .catch((error) => console.log("error in fetching prefectures", error));
  }, []);

  const [data, setData] = useState<Prefecture[]>([]);
  const [selectedPref, setSelectedPref] = useState<Prefecture | null>(null);

  const handleCheckboxChange = (prefecture: Prefecture) => {
    setSelectedPref(prefecture);
  };

  return (
    <div style={{ padding: 50 }}>
      {data?.length > 0 ? (
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
                  type="checkbox"
                  checked={selectedPref?.prefCode === prefecture.prefCode}
                  onChange={() => handleCheckboxChange(prefecture)}
                />
                <span>{prefecture.prefName}</span>
              </div>
            ))}
          </div>
          {selectedPref && (
            <p>Selected Prefecture Code: {selectedPref.prefCode}</p>
          )}
        </div>
      ) : (
        <p>no data found</p>
      )}
    </div>
  );
};

export default Prefectures;
