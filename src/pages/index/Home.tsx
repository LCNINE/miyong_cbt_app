import { ComboboxForm } from "../../components/ComboboxForm";

const Homedd: React.FC = () => {

  return (
    <div className="flex flex-col items-center min-h-[80vh] justify-center bg-white">
      <ComboboxForm/>
    </div>
  );
};


export default function Home (){
  return (
    <Homedd />
  )
}
