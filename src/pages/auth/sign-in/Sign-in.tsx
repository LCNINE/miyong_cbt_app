import { Button } from "@/components/ui/button";
import SignInForm from "./SignInForm";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate(); // useNavigate 훅 사용

  function handleSignUp() {
    navigate("/sign-up"); // /sign-up으로 이동
  }

  return (
    <div className="h-full flex flex-col justify-center">
      <SignInForm />
      <div className="text-center mt-5">
        <Button onClick={handleSignUp}>회원가입</Button>
      </div>
    </div>
  );
}
