import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Board } from '../config';

interface OneBoardCardProps {
  board: Board;
  onAction: (boardId: string, action: string) => void;
}

export function OneBoardCard({ board, onAction }: OneBoardCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  console.log('Board completo:', board);
  console.log('Board columns:', board.columns);

  // Calcular totais de anexos e membros de todos os cards do board
  let totalAttachments = 0;
  const uniqueMembers = new Set<string>();

  if (board.columns && Array.isArray(board.columns)) {
    board.columns.forEach((column, columnIndex) => {
      console.log(`Coluna ${columnIndex}:`, column);
      if (column.cards && Array.isArray(column.cards)) {
        column.cards.forEach((card, cardIndex) => {
          console.log(`Card ${cardIndex} da coluna ${columnIndex}:`, card);
          
          // Contar anexos
          if (card.attachments && Array.isArray(card.attachments)) {
            totalAttachments += card.attachments.length;
            console.log(`Card ${card.title} tem ${card.attachments.length} anexos`);
          }
          
          // Contar membros únicos
          if (card.members && Array.isArray(card.members)) {
            card.members.forEach(member => {
              uniqueMembers.add(member.id);
              console.log(`Adicionado membro ${member.name} (${member.id})`);
            });
          }
        });
      }
    });
  }

  const totalMembers = uniqueMembers.size;

  console.log(`Board ${board.name}: ${totalAttachments} anexos, ${totalMembers} membros únicos`);
  console.log('Membros únicos encontrados:', Array.from(uniqueMembers));

  const handleCardClick = () => {
    onAction(board.id, 'view');
  };

  return (
    <Card 
      className="group hover:shadow-lg transition-shadow duration-200 h-48 flex flex-col cursor-pointer" 
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base sm:text-lg font-semibold line-clamp-2 flex-1 min-w-0">
            {board.name}
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-1 flex-shrink-0">
            {board.isShared && (
              <Badge variant="secondary" className="text-xs">
                Compartilhado
              </Badge>
            )}
            <Badge 
              variant={board.isActive ? "default" : "outline"}
              className="text-xs"
            >
              {board.isActive ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3 flex-1 flex flex-col justify-between">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {board.description}
        </p>
      </CardContent>
    </Card>
  );
}