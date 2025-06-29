
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { X, Plus, User } from 'lucide-react';
import { Member } from '../config';

interface MemberManagerProps {
  members: Member[];
  onAddMember: (member: Member) => void;
  onRemoveMember: (memberId: string) => void;
}

export function MemberManager({ members, onAddMember, onRemoveMember }: MemberManagerProps) {
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');

  const handleAddMember = () => {
    if (newMemberName.trim() && newMemberEmail.trim()) {
      const newMember: Member = {
        id: crypto.randomUUID(),
        name: newMemberName.trim(),
        email: newMemberEmail.trim(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newMemberEmail.trim()}`
      };
      onAddMember(newMember);
      setNewMemberName('');
      setNewMemberEmail('');
    }
  };

  return (
    <div className="space-y-3">
      {/* Current Members */}
      {members.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Membros atuais</Label>
          <div className="space-y-2">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-2 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="text-xs">
                      {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{member.name}</span>
                    <span className="text-xs text-muted-foreground">{member.email}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => onRemoveMember(member.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Member */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Adicionar membro</Label>
        <div className="space-y-2">
          <Input
            placeholder="Nome do membro"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
          />
          <Input
            placeholder="Email do membro"
            type="email"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddMember();
              }
            }}
          />
          <Button 
            onClick={handleAddMember} 
            size="sm" 
            className="w-full"
            disabled={!newMemberName.trim() || !newMemberEmail.trim()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Membro
          </Button>
        </div>
      </div>
    </div>
  );
}
