import { Helmet } from "react-helmet-async";
import SignUpForm from "./SignUpForm";

export default function SignUp() {
  return (
    <div className="h-full max-h-full flex flex-col justify-center">
      <Helmet>
        <title>미용필시시험/sign-up - 미용필기시험 회원가입</title>
        <meta name="description" content="미용필기시험 로그인" />
        <meta
          name="google-site-verification"
          content="LK2lMpCXPbmg_peIKBrco_0Rp_scYKp4Mn0u5yI6vCI"
        />
        <meta
          name="naver-site-verification"
          content="dd4919f9da4dfbafdd79f35ed97505cf41418c50"
        />
        <link
          rel="canonical"
          href="https://www.xn--ok0b94xilff7df2wpza.com/sign-up"
        />
      </Helmet>
      <SignUpForm />
    </div>
  );
}
