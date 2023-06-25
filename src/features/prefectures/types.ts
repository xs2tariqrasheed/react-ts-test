export interface Point {
  year: number;
  value: number;
}

export interface Prefecture {
  prefCode: number;
  prefName: string;
  selected: boolean;
  stroke?: string;
  composition: {
    総人口: Point[];
    年少人口: Point[];
    生産年齢人口: Point[];
    老年人口: Point[];
  } | null;
}

export type StatType = "総人口" | "年少人口" | "生産年齢人口" | "老年人口";
