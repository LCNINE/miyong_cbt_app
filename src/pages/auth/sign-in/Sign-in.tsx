import { Button } from "@/components/ui/button";
import SignInForm from "./SignInForm";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function SignIn() {
  const navigate = useNavigate(); // useNavigate 훅 사용

  function handleSignUp() {
    navigate("/sign-up"); // /sign-up으로 이동
  }

  return (
    <div className="h-full flex flex-col justify-center">
      <Helmet>
        <title>미용필시시험/sign-in - 미용필기시험 로그인</title>
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
          href="https://www.xn--ok0b94xilff7df2wpza.com/sign-in"
        />
      </Helmet>
      <SignInForm />
      <div className="text-center mt-5">
        <Button onClick={handleSignUp}>회원가입</Button>
      </div>
    </div>
  );
}
