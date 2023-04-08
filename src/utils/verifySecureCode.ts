import { env } from "~/env.mjs";
const VerifyCode = (code: string): boolean => {
  const TodayDate = new Date().getDate();
  const TodayMonth = new Date().getMonth();
  const TodayYear = new Date().getFullYear();
  const firstPart = TodayDate + TodayMonth + TodayYear;
  const secondPart = process.env.SECRET_KEY as string;
  const fullCode = firstPart.toString() + secondPart;
  console.log(fullCode);
  return code === fullCode;
};

export default VerifyCode;
