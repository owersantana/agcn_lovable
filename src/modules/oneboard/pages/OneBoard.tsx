import { useEffect } from "react";
import { OneBoardGrid } from "../components/OneBoardGrid";

const OneBoard = () => {
  useEffect(() => {
    console.log('OneBoard component mounted');
    console.log('OneBoard - Current pathname:', window.location.pathname);
  }, []);

  return (
    <div className="space-y-6">
      {console.log('OneBoard component rendering')}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">OneBoard</h1>
          <p className="text-gray-600">Gerencie seus quadros e projetos</p>
        </div>
      </div>
      
      <OneBoardGrid />
    </div>
  );
};

export default OneBoard;