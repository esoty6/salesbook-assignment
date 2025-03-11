import dayjs from "dayjs";
import "dayjs/locale/de";
import weekday from "dayjs/plugin/weekday";

export const getExchangeRates = async () => {
  const data = await (
    await fetch(`https://api.frankfurter.dev/v1/latest?base=PLN`, {
      method: "get",
    })
  ).json();

  return data;
};

export const getHistoricalRates = async (selectedCurrency: string) => {
  dayjs.locale("pl");
  dayjs.extend(weekday);
  const previousMonday = dayjs().weekday(-6);

  const data = await (
    await fetch(
      `https://api.frankfurter.dev/v1/${previousMonday.format(
        "YYYY-MM-DD"
      )}..?base=PLN&symbols=${selectedCurrency}`,
      {
        method: "get",
      }
    )
  ).json();

  return data;
};
