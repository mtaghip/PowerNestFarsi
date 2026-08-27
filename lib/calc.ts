export const CITIES: Record<string, number> = {
  تهران: 5.2,
  اصفهان: 5.7,
  یزد: 6.0,
  شیراز: 5.8,
  تبریز: 4.9,
  مشهد: 5.3,
  اهواز: 5.5,
  بندرعباس: 5.6,
  کرمان: 6.1,
  رشت: 3.9,
};

export const TARIFF = 4500;

export type Goal = "saving" | "backup" | "offgrid";

export interface SizingInput {
  kwh: number;
  city: string;
  goal: Goal;
  backupHours: number;
}

export interface SizingResult {
  irr: number;
  panels: number;
  arrayKw: number;
  battery: number;
  inverterKw: number;
  annualGen: number;
  annualSave: number;
  cost: number;
  roof: number;
  payback: number;
  co2: number;
  surplus: number;
}

const GOAL_FACTOR: Record<Goal, number> = { saving: 0.75, backup: 0.95, offgrid: 1.25 };

export function sizeSystem({ kwh, city, goal, backupHours }: SizingInput): SizingResult {
  const irr = CITIES[city] ?? 5.2;
  const goalF = GOAL_FACTOR[goal];
  const daily = (kwh / 30) * goalF;
  const panelDaily = 0.61 * irr * 0.78;
  const panels = Math.max(2, Math.ceil(daily / panelDaily));
  const arrayKw = panels * 0.61;
  const battery =
    goal === "saving"
      ? Math.max(5, Math.round(((kwh / 30) * 0.35) / 5) * 5)
      : Math.max(5, Math.round(((kwh / 30) * (backupHours / 24) * 1.2) / 5) * 5);
  const inverterKw = Math.max(3, Math.ceil(arrayKw * 0.9));
  const annualGen = panels * panelDaily * 365;
  const annualSave = annualGen * TARIFF;
  const cost = panels * 9_500_000 + inverterKw * 13_000_000 + battery * 19_000_000 + 45_000_000;
  return {
    irr,
    panels,
    arrayKw,
    battery,
    inverterKw,
    annualGen,
    annualSave,
    cost,
    roof: panels * 2.6,
    payback: cost / annualSave,
    co2: annualGen * 0.65,
    surplus: Math.max(0, annualGen - kwh * 12),
  };
}
