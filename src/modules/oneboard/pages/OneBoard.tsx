import { useEffect, useState } from "react";
import { OneBoardGrid } from "../components/OneBoardGrid";
import { trelloTemplates } from "../data/trelloTemplates";

const OneBoard = () => {
  const [boards, setBoards] = useState(trelloTemplates);

  useEffect(() => {
    console.log('OneBoard component mounted');
    console.log('OneBoard - Current pathname:', window.location.pathname);
    console.log('OneBoard - boards state:', boards);
  }, [boards]);

  const handleBoardAction = (action: string, boardId?: string) => {
    console.log('OneBoard - handleBoardAction called:', { action, boardId });
    // Placeholder function for board actions
  };

  return (
    <div className="space-y-6">
      {console.log('OneBoard component rendering')}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">OneBoard</h1>
          <p className="text-gray-600">Gerencie seus quadros e projetos</p>
        </div>
      </div>
      
      <OneBoardGrid boards={boards} onBoardAction={handleBoardAction} />
    </div>
  );
};

export default OneBoard;