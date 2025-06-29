import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, Tag, X, User, List, Calendar, Paperclip, Share, Archive, Copy, Move, Image, Edit, Trash2 } from 'lucide-react';
import { BoardCard, Label as LabelType, Checklist, Member, BoardColumn } from '../config';
import { LabelManager } from './LabelManager';
import { ChecklistManager } from './ChecklistManager';
import { DatePicker } from './DatePicker';
import { CoverImageSelector } from './CoverImageSelector';
import { MemberManager } from './MemberManager';
import { DescriptionEditor } from './DescriptionEditor';
import { AttachmentManager, Attachment } from './AttachmentManager';
import { ConfirmationModal } from './ConfirmationModal';
import { ShareCardModal } from './ShareCardModal';
import { MoveCardModal } from './MoveCardModal';
import { CopyCardModal } from './CopyCardModal';
import { useToast } from '@/hooks/use-toast';

interface CardDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: BoardCard | null;
  onUpdateCard: (cardId: string, updates: Partial<BoardCard>) => void;
  columns?: BoardColumn[];
  onMoveCard?: (cardId: string, targetColumnId: string, position: number) => void;
  onCopyCard?: (card: BoardCard, targetColumnId: string, position: number, newTitle: string, copyOptions: any) => void;
}

export function CardDetailModal({ 
  isOpen, 
  onClose, 
  card, 
  onUpdateCard, 
  columns = [],
  onMoveCard,
  onCopyCard
}: CardDetailModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [newTag, setNewTag] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Array<{id: string, text: string, author: string, createdAt: string}>>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description || '');
      setComments(card.comments || []);
    }
  }, [card]);

  if (!card) return null;

  const handleSave = () => {
    onUpdateCard(card.id, {
      title: title.trim(),
      description: description.trim(),
    });
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !card.tags?.includes(newTag.trim())) {
      onUpdateCard(card.id, {
        tags: [...(card.tags || []), newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onUpdateCard(card.id, {
      tags: card.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  const setPriority = (priority: 'low' | 'medium' | 'high' | undefined) => {
    onUpdateCard(card.id, { priority });
  };

  const getPriorityText = (priority?: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'low': return 'Baixa';
      case 'medium': return 'Média';
      case 'high': return 'Alta';
      default: return 'Nenhuma';
    }
  };

  const addComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: crypto.randomUUID(),
        text: comment.trim(),
        author: 'Usuário',
        createdAt: new Date().toISOString()
      };
      const updatedComments = [...comments, newComment];
      setComments(updatedComments);
      onUpdateCard(card.id, { comments: updatedComments });
      setComment('');
    }
  };

  const startEditComment = (commentId: string, currentText: string) => {
    setEditingCommentId(commentId);
    setEditingCommentText(currentText);
  };

  const saveEditComment = (commentId: string) => {
    if (editingCommentText.trim()) {
      const updatedComments = comments.map(c => 
        c.id === commentId 
          ? { ...c, text: editingCommentText.trim() }
          : c
      );
      setComments(updatedComments);
      onUpdateCard(card.id, { comments: updatedComments });
    }
    setEditingCommentId(null);
    setEditingCommentText('');
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditingCommentText('');
  };

  const deleteComment = (commentId: string) => {
    const updatedComments = comments.filter(c => c.id !== commentId);
    setComments(updatedComments);
    onUpdateCard(card.id, { comments: updatedComments });
  };

  const handleShareCard = () => {
    setIsShareModalOpen(true);
  };

  const handleArchiveCard = () => {
    toast({
      title: "Card arquivado",
      description: `O card "${card.title}" foi arquivado com sucesso.`
    });
    onClose();
  };

  const handleMoveCard = (targetColumnId: string, position: number) => {
    if (onMoveCard) {
      onMoveCard(card.id, targetColumnId, position);
      toast({
        title: "Card movido",
        description: `O card "${card.title}" foi movido com sucesso.`
      });
    }
  };

  const handleCopyCard = (targetColumnId: string, position: number, newTitle: string, copyOptions: any) => {
    if (onCopyCard) {
      onCopyCard(card, targetColumnId, position, newTitle, copyOptions);
      toast({
        title: "Card copiado",
        description: `O card "${newTitle}" foi criado com sucesso.`
      });
    }
  };

  const handleAddLabel = (label: LabelType) => {
    onUpdateCard(card.id, {
      labels: [...(card.labels || []), label]
    });
  };

  const handleRemoveLabel = (labelId: string) => {
    onUpdateCard(card.id, {
      labels: card.labels?.filter(label => label.id !== labelId) || []
    });
  };

  const handleUpdateChecklists = (checklists: Checklist[]) => {
    onUpdateCard(card.id, { checklists });
  };

  const handleDateChange = (date: string | undefined) => {
    onUpdateCard(card.id, { dueDate: date });
  };

  const handleCoverImageChange = (url: string | undefined) => {
    onUpdateCard(card.id, { coverImage: url });
  };

  const handleAddMember = (member: Member) => {
    onUpdateCard(card.id, {
      members: [...(card.members || []), member]
    });
  };

  const handleRemoveMember = (memberId: string) => {
    onUpdateCard(card.id, {
      members: card.members?.filter(member => member.id !== memberId) || []
    });
  };

  const handleAddAttachment = (attachment: Attachment) => {
    onUpdateCard(card.id, {
      attachments: [...(card.attachments || []), attachment]
    });
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    onUpdateCard(card.id, {
      attachments: card.attachments?.filter(attachment => attachment.id !== attachmentId) || []
    });
  };

  const sidebarActions = [
    { 
      icon: User, 
      label: 'Membros', 
      section: 'add', 
      action: () => setActiveSection(activeSection === 'members' ? null : 'members'),
      key: 'members'
    },
    { 
      icon: Tag, 
      label: 'Etiquetas', 
      section: 'add', 
      action: () => setActiveSection(activeSection === 'labels' ? null : 'labels'),
      key: 'labels'
    },
    { 
      icon: List, 
      label: 'Checklist', 
      section: 'add', 
      action: () => setActiveSection(activeSection === 'checklist' ? null : 'checklist'),
      key: 'checklist'
    },
    { 
      icon: Calendar, 
      label: 'Datas', 
      section: 'add', 
      action: () => setActiveSection(activeSection === 'dates' ? null : 'dates'),
      key: 'dates'
    },
    { 
      icon: Paperclip, 
      label: 'Anexo', 
      section: 'add', 
      action: () => setActiveSection(activeSection === 'attachments' ? null : 'attachments'),
      key: 'attachments'
    },
    { 
      icon: Image, 
      label: 'Capa', 
      section: 'add', 
      action: () => setActiveSection(activeSection === 'cover' ? null : 'cover'),
      key: 'cover'
    },
    { 
      icon: Move, 
      label: 'Mover', 
      section: 'actions', 
      action: () => setIsMoveModalOpen(true),
      key: 'move'
    },
    { 
      icon: Copy, 
      label: 'Copiar', 
      section: 'actions', 
      action: () => setIsCopyModalOpen(true),
      key: 'copy'
    },
    { 
      icon: Archive, 
      label: 'Arquivar', 
      section: 'actions', 
      action: () => setIsArchiveModalOpen(true),
      key: 'archive'
    },
    { 
      icon: Share, 
      label: 'Compartilhar', 
      section: 'actions', 
      action: () => handleShareCard(),
      key: 'share'
    },
  ];

  const addActions = sidebarActions.filter(action => action.section === 'add');
  const actionsList = sidebarActions.filter(action => action.section === 'actions');

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden p-0 flex flex-col">
          <div className="flex h-full min-h-0">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-0">
              {card.coverImage && (
                <div className="flex-shrink-0">
                  <img
                    src={card.coverImage}
                    alt="Capa do card"
                    className="w-full h-32 object-cover"
                  />
                </div>
              )}

              <div className="flex-1 p-6 overflow-y-auto min-h-0">
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-xl">{card.title}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="card-title">Título</Label>
                    <Input
                      id="card-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Título do card"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="card-description">Descrição</Label>
                    <DescriptionEditor
                      value={description}
                      onChange={setDescription}
                      placeholder="Adicione uma descrição mais detalhada..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Prioridade</Label>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant={!card.priority ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPriority(undefined)}
                      >
                        Nenhuma
                      </Button>
                      {(['low', 'medium', 'high'] as const).map((priority) => (
                        <Button
                          key={priority}
                          variant={card.priority === priority ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPriority(priority)}
                        >
                          {getPriorityText(priority)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Members Display */}
                  {card.members && card.members.length > 0 && (
                    <div className="space-y-2">
                      <Label>Membros</Label>
                      <div className="flex flex-wrap gap-2">
                        {card.members.map((member) => (
                          <div key={member.id} className="flex items-center gap-2 bg-muted px-2 py-1 rounded-lg">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback className="text-xs">
                                {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{member.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Labels Display */}
                  {card.labels && card.labels.length > 0 && (
                    <div className="space-y-2">
                      <Label>Etiquetas</Label>
                      <div className="flex flex-wrap gap-2">
                        {card.labels.map((label) => (
                          <Badge 
                            key={label.id}
                            style={{ backgroundColor: label.color, color: 'white' }}
                          >
                            {label.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {card.tags && card.tags.length > 0 && (
                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {card.tags?.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {tag}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => removeTag(tag)}
                            >
                              <X className="h-2 w-2" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Nova tag"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addTag();
                            }
                          }}
                        />
                        <Button onClick={addTag} size="sm">
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Checklists Display */}
                  {card.checklists && card.checklists.length > 0 && (
                    <div className="space-y-2">
                      <Label>Checklists</Label>
                      <ChecklistManager
                        checklists={card.checklists}
                        onUpdateChecklists={handleUpdateChecklists}
                      />
                    </div>
                  )}

                  {/* Due Date Display */}
                  {card.dueDate && (
                    <div className="space-y-2">
                      <Label>Data de vencimento</Label>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(card.dueDate).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  )}

                  {/* Attachments Display */}
                  {card.attachments && card.attachments.length > 0 && (
                    <div className="space-y-2">
                      <Label>Anexos ({card.attachments.length})</Label>
                      <AttachmentManager
                        attachments={card.attachments}
                        onAddAttachment={handleAddAttachment}
                        onRemoveAttachment={handleRemoveAttachment}
                      />
                    </div>
                  )}

                  {/* Comments Section */}
                  <div className="space-y-4 border-t pt-6">
                    <Label className="text-base font-semibold">Atividade</Label>
                    
                    <div className="space-y-2">
                      <Label htmlFor="comment">Escrever um comentário</Label>
                      <div className="flex gap-2">
                        <DescriptionEditor
                          value={comment}
                          onChange={setComment}
                          placeholder="Escrever um comentário..."
                        />
                      </div>
                      <Button onClick={addComment} size="sm" disabled={!comment.trim()}>
                        Comentar
                      </Button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-3">
                      {comments.map((commentItem) => (
                        <div key={commentItem.id} className="bg-muted p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{commentItem.author}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(commentItem.createdAt).toLocaleDateString('pt-BR')} às {new Date(commentItem.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => startEditComment(commentItem.id, commentItem.text)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                onClick={() => deleteComment(commentItem.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {editingCommentId === commentItem.id ? (
                            <div className="space-y-2">
                              <DescriptionEditor
                                value={editingCommentText}
                                onChange={setEditingCommentText}
                                placeholder="Editar comentário..."
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => saveEditComment(commentItem.id)}
                                  disabled={!editingCommentText.trim()}
                                >
                                  Salvar
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={cancelEditComment}
                                >
                                  Cancelar
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm">{commentItem.text}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      Criado em {new Date(card.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      Atualizado em {new Date(card.updatedAt).toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t border-border">
                    <Button variant="outline" onClick={onClose}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSave}>
                      Salvar
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-80 bg-muted/30 border-l flex flex-col">
              <div className="p-4 space-y-4 overflow-y-auto flex-1">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Adicionar ao card
                  </Label>
                  {addActions.map((action, index) => (
                    <Button
                      key={index}
                      variant={activeSection === action.key ? "default" : "ghost"}
                      size="sm"
                      className={`w-full justify-start text-sm h-9 transition-colors ${
                        activeSection === action.key 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-background hover:bg-muted"
                      }`}
                      onClick={action.action}
                    >
                      <action.icon className="h-4 w-4 mr-3" />
                      {action.label}
                    </Button>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Ações
                  </Label>
                  {actionsList.map((action, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-sm h-9 bg-background hover:bg-muted transition-colors"
                      onClick={action.action}
                    >
                      <action.icon className="h-4 w-4 mr-3" />
                      {action.label}
                    </Button>
                  ))}
                </div>

                {/* Active Section Content */}
                {activeSection === 'members' && (
                  <div className="space-y-2 p-3 border rounded-lg bg-background">
                    <h4 className="font-medium">Membros</h4>
                    <MemberManager
                      members={card.members || []}
                      onAddMember={handleAddMember}
                      onRemoveMember={handleRemoveMember}
                    />
                  </div>
                )}

                {activeSection === 'labels' && (
                  <div className="space-y-2 p-3 border rounded-lg bg-background">
                    <h4 className="font-medium">Etiquetas</h4>
                    <LabelManager
                      labels={card.labels || []}
                      onAddLabel={handleAddLabel}
                      onRemoveLabel={handleRemoveLabel}
                    />
                  </div>
                )}

                {activeSection === 'checklist' && (
                  <div className="space-y-2 p-3 border rounded-lg bg-background">
                    <h4 className="font-medium">Checklist</h4>
                    <ChecklistManager
                      checklists={card.checklists || []}
                      onUpdateChecklists={handleUpdateChecklists}
                    />
                  </div>
                )}

                {activeSection === 'dates' && (
                  <div className="space-y-2 p-3 border rounded-lg bg-background">
                    <h4 className="font-medium">Datas</h4>
                    <DatePicker
                      date={card.dueDate}
                      onDateChange={handleDateChange}
                    />
                  </div>
                )}

                {activeSection === 'cover' && (
                  <div className="space-y-2 p-3 border rounded-lg bg-background">
                    <h4 className="font-medium">Capa</h4>
                    <CoverImageSelector
                      coverImage={card.coverImage}
                      onImageChange={handleCoverImageChange}
                    />
                  </div>
                )}

                {activeSection === 'attachments' && (
                  <div className="space-y-2 p-3 border rounded-lg bg-background">
                    <h4 className="font-medium">Anexos</h4>
                    <AttachmentManager
                      attachments={card.attachments || []}
                      onAddAttachment={handleAddAttachment}
                      onRemoveAttachment={handleRemoveAttachment}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ShareCardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        cardTitle={card.title}
      />

      <ConfirmationModal
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        onConfirm={handleArchiveCard}
        title="Arquivar Card"
        description={`Tem certeza que deseja arquivar o card "${card.title}"? Você poderá restaurá-lo posteriormente.`}
        confirmText="Arquivar"
        cancelText="Cancelar"
      />

      <MoveCardModal
        isOpen={isMoveModalOpen}
        onClose={() => setIsMoveModalOpen(false)}
        onMove={handleMoveCard}
        currentColumnId={card.columnId}
        columns={columns}
        cardTitle={card.title}
      />

      <CopyCardModal
        isOpen={isCopyModalOpen}
        onClose={() => setIsCopyModalOpen(false)}
        onCopy={handleCopyCard}
        currentColumnId={card.columnId}
        columns={columns}
        cardTitle={card.title}
      />
    </>
  );
}
