import { Helmet } from "react-helmet-async";
import { ComboboxForm } from "./combo/ComboboxForm";

export default function Home() {
  return (
    <div className="flex flex-col items-center h-full justify-center bg-white relative">
      <Helmet>
        <title>미용필기시험/ - 미용필기시험 root page</title>
        <meta name="description" content="미용필기시험 root page" />
        <meta name="google-site-verification" content="LK2lMpCXPbmg_peIKBrco_0Rp_scYKp4Mn0u5yI6vCI" />
        <meta name="naver-site-verification" content="dd4919f9da4dfbafdd79f35ed97505cf41418c50" />
      </Helmet>
      <div className="flex items-center justify-center flex-1 h-full w-full">
        <ComboboxForm />
      </div>

      <div className="flex flex-0 justify-end items-end w-full p-4">
        {/* 카카오톡 문의하기 버튼 */}
        <a
          href="http://pf.kakao.com/_xaxgxazs"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black hover:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-300 underline hover:no-underline focus:no-underline"
        >
          카카오톡 문의하기
        </a>
      </div>
    </div>
  );
}
