import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

const ERROR_MESSAGES: Record<string, string> = {
  oauth_denied: "아몬드영 로그인이 취소되었습니다.",
  session_expired: "로그인 세션이 만료되었습니다. 다시 시도해주세요.",
  code_expired: "로그인 시간이 초과되었습니다. 다시 시도해주세요.",
};

// supabase/functions/almond-auth 의 callback 이 token_hash 를 넘겨주는 페이지
export default function AlmondCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fail = (reason: string | null) => {
      toast({
        title: "로그인 실패",
        description: ERROR_MESSAGES[reason ?? ""] ?? "로그인 중 문제가 발생했습니다.",
      });
      navigate("/sign-in", { replace: true });
    };

    const tokenHash = params.get("token_hash");
    if (!tokenHash) return fail(params.get("error"));

    supabase.auth
      .verifyOtp({ token_hash: tokenHash, type: "magiclink" })
      .then(({ data, error }) => {
        if (error) return fail(null);
        toast({ title: "로그인 성공", description: data.user?.email + "님 환영합니다!" });
        navigate(params.get("returnTo") ?? "/", { replace: true });
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}
