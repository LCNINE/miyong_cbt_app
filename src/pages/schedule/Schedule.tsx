import { Helmet } from "react-helmet-async";
import Calendar1 from "./Calendar1";
import Calendar from "./Calendar";

function ExamSchedulePage() {
  return (
    <div>
      <Helmet>
        <title>미용필기시험/ 미용필기시험 미용사자격증 연간일정</title>
        <meta name="description" content="미용시험 일정, 미용필기시험 연간 일정, 2025년 미용사 자격증 일정, 미용사 시험 달력" />
        <meta
          name="google-site-verification"
          content="LK2lMpCXPbmg_peIKBrco_0Rp_scYKp4Mn0u5yI6vCI"
        />
        <meta
          name="naver-site-verification"
          content="dd4919f9da4dfbafdd79f35ed97505cf41418c50"
        />
      </Helmet>
      <Calendar1 />
      {/* <Calendar /> 잘가라 내 노력아 */}
    </div>
  );
}

export default ExamSchedulePage;
