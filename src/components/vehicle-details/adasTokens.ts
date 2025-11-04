export const adasTokens = {
  radius: {
    card: 16,
    chip: 999,
    clip: 12,
  },
  color: {
    light: {
      ink: "#0F172A",
      muted: "#475569",
      surface: "#F7F7F7",
      border: "#E6E8EC",
      adasBlue: "rgba(47,124,246,0.12)",
      adasLine: "rgba(47,124,246,0.65)",
      sensorGreen: "#1BBE7A",
      sensorCyan: "#19B5F1",
      sensorAmber: "#F4A70D",
      chipHover: "#F2F5F7",
      cardShadow: "rgba(0,0,0,0.1)",
    },
    dark: {
      ink: "#F8FAFC",
      muted: "#94A3B8",
      surface: "#1E293B",
      border: "#334155",
      adasBlue: "rgba(59,130,246,0.15)",
      adasLine: "rgba(59,130,246,0.75)",
      sensorGreen: "#22C55E",
      sensorCyan: "#38BDF8",
      sensorAmber: "#FBBF24",
      chipHover: "rgba(255,255,255,0.08)",
      cardShadow: "rgba(0,0,0,0.3)",
    },
  },
  type: {
    h4: "text-[28px] leading-[34px] font-semibold",
    body: "text-[16px] leading-[24px]",
    cap: "text-[13px] leading-[18px]",
  },
  grid: {
    max: "max-w-[1440px]",
    gutter: "gap-6",
    colLeft: "lg:w-[60%]",
    colRight: "lg:w-[40%]",
  },
};

export type AdasTokens = typeof adasTokens;
