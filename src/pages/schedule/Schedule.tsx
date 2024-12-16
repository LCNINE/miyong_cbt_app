import { Helmet } from "react-helmet-async";
import Calendar from "./Calendar";

function ExamSchedulePage() {
  return (
    <div>
      <Helmet>
        <title>미용필기시험/ - 미용필기시험 연간일정</title>
        <meta name="description" content="미용필기시험 연간일정, 2025년 미용사 자격증 시험 일정" />
        <meta
          name="google-site-verification"
          content="LK2lMpCXPbmg_peIKBrco_0Rp_scYKp4Mn0u5yI6vCI"
        />
        <meta
          name="naver-site-verification"
          content="dd4919f9da4dfbafdd79f35ed97505cf41418c50"
        />
      </Helmet>
      <Calendar />
    </div>
  );
}

export default ExamSchedulePage;
